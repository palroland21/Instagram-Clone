package com.instagram.clone.service;

import com.instagram.clone.dto.request.PostRequest;
import com.instagram.clone.dto.response.CommentResponse;
import com.instagram.clone.dto.response.PostResponse;
import com.instagram.clone.model.Comment;
import com.instagram.clone.model.CommentVote;
import com.instagram.clone.model.Picture;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.Tag;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.PostStatus;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.repository.CommentRepository;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.PostVoteRepository;
import com.instagram.clone.repository.TagRepository;
import com.instagram.clone.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.LinkedHashSet;
import java.util.Set;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final PostVoteRepository postVoteRepository;

    public PostService(PostRepository postRepository,
                       TagRepository tagRepository,
                       UserRepository userRepository,
                       CommentRepository commentRepository,
                       PostVoteRepository postVoteRepository) {
        this.postRepository = postRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.postVoteRepository = postVoteRepository;
    }

    public PostResponse create(PostRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateCaption(request.getCaption());
        validatePictureUrls(request.getPictureUrls());

        Post post = new Post();
        post.setUser(user);
        post.setLocation(request.getLocation());
        post.setCaption(request.getCaption());
        post.setTitle(resolveTitle(request));
        post.setCreatedAt(LocalDateTime.now());
        post.setStatus(request.getStatus() != null ? request.getStatus() : PostStatus.JUST_POSTED);
        post.setTags(getOrCreateTags(request.getTagNames()));

        addPicturesToPost(post, request.getPictureUrls());

        Post saved = postRepository.save(post);
        return mapToResponse(saved, request.getUserId());
    }

    public PostResponse getById(Long id, Long currentUserId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return mapToResponse(post, currentUserId);
    }

    public List<PostResponse> getAll() {
        List<PostResponse> responses = new ArrayList<>();
        for (Post post : postRepository.findAllByOrderByCreatedAtDesc()) {
            responses.add(mapToResponse(post, null));
        }
        return responses;
    }

    public List<PostResponse> getAll(Long currentUserId) {
        List<PostResponse> responses = new ArrayList<>();
        for (Post post : postRepository.findAllByOrderByCreatedAtDesc()) {
            responses.add(mapToResponse(post, currentUserId));
        }
        return responses;
    }

    public List<PostResponse> search(String tag, String text, Long userId, Long currentUserId) {
        List<PostResponse> responses = new ArrayList<>();

        for (Post post : postRepository.searchPosts(
                normalizeFilter(tag),
                normalizeFilter(text),
                userId
        )) {
            responses.add(mapToResponse(post, currentUserId));
        }

        return responses;
    }

    public PostResponse update(Long id, PostRequest request) {
        Post existing = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        //only the author can edit
        if (!existing.getUser().getId().equals(request.getUserId())) {
            throw new RuntimeException("Unauthorized: You don't have permission to edit this post!");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateCaption(request.getCaption());
        validatePictureUrls(request.getPictureUrls());

        existing.setUser(user);
        existing.setLocation(request.getLocation());
        existing.setCaption(request.getCaption());
        existing.setTitle(resolveTitle(request));

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        existing.setTags(getOrCreateTags(request.getTagNames()));

        existing.clearPictures();
        addPicturesToPost(existing, request.getPictureUrls());

        Post updated = postRepository.save(existing);
        return mapToResponse(updated, request.getUserId());
    }

    public void delete(Long id, Long currentUserId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        //only the author can delete
        if (!post.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized: You don't have permission to delete this post!");
        }

        postRepository.delete(post);
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    private void validatePictureUrls(List<String> pictureUrls) {
        if (pictureUrls == null || pictureUrls.isEmpty()) {
            throw new RuntimeException("A post must contain at least one picture.");
        }
    }

    private void validateCaption(String caption) {
        if (caption == null || caption.trim().isEmpty()) {
            throw new RuntimeException("A post must contain text.");
        }
    }

    private void addPicturesToPost(Post post, List<String> pictureUrls) {
        for (String url : pictureUrls) {
            if (url == null || url.trim().isEmpty()) {
                continue;
            }

            Picture picture = new Picture();
            picture.setPictureUrl(url.trim());
            post.addPicture(picture);
        }

        if (post.getPictures().isEmpty()) {
            throw new RuntimeException("A post must contain at least one valid picture.");
        }
    }

    private List<Tag> getOrCreateTags(List<String> tagNames) {
        List<Tag> tags = new ArrayList<>();
        Set<String> cleanTagNames = new LinkedHashSet<>();

        if (tagNames != null) {
            for (String tagName : tagNames) {
                if (tagName == null || tagName.trim().isEmpty()) {
                    continue;
                }

                String cleanTagName = tagName.trim().replaceFirst("^#", "").toLowerCase();

                if (!cleanTagName.isEmpty()) {
                    cleanTagNames.add(cleanTagName);
                }
            }
        }

        if (cleanTagNames.isEmpty()) {
            throw new RuntimeException("A post must contain at least one tag.");
        }

        for (String cleanTagName : cleanTagNames) {
            Tag tag = tagRepository.findByName(cleanTagName)
                    .orElseGet(() -> {
                        Tag newTag = new Tag();
                        newTag.setName(cleanTagName);
                        return tagRepository.save(newTag);
                    });

            tags.add(tag);
        }

        return tags;
    }

    private String resolveTitle(PostRequest request) {
        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            return request.getTitle().trim();
        }

        String caption = request.getCaption();
        if (caption == null || caption.trim().isEmpty()) {
            return "Post";
        }

        String cleanCaption = caption.trim();
        return cleanCaption.length() <= 60 ? cleanCaption : cleanCaption.substring(0, 60);
    }

    private String normalizeFilter(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim().replaceFirst("^#", "");
    }

    private PostResponse mapToResponse(Post post, Long currentUserId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setUserId(post.getUser().getId());
        response.setUsername(post.getUser().getUsername());
        response.setUserProfilePicture(post.getUser().getProfilePicture());
        response.setPictureUrls(extractPictureUrls(post.getPictures()));
        response.setLocation(post.getLocation());
        response.setCaption(post.getCaption());
        response.setTitle(post.getTitle());
        response.setCreatedAt(post.getCreatedAt());
        List<Comment> comments = commentRepository.findByPostId(post.getId());
        response.setStatus(resolveDisplayStatus(post, comments));

        List<Long> tagIds = new ArrayList<>();
        List<String> tagNames = new ArrayList<>();

        if (post.getTags() != null) {
            for (Tag tag : post.getTags()) {
                tagIds.add(tag.getId());
                tagNames.add(tag.getName());
            }
        }

        response.setTagIds(tagIds);
        response.setTagNames(tagNames);

        List<CommentResponse> commentResponses = new ArrayList<>();
        for (Comment comment : comments) {
            CommentResponse cr = new CommentResponse();

            int commentLikeCount = 0;
            int commentDislikeCount = 0;
            boolean commentLikedByCurrentUser = false;
            boolean commentDislikedByCurrentUser = false;

            for (CommentVote vote : comment.getVotes()) {
                if (vote.getVoteType() == VoteType.LIKE) {
                    commentLikeCount++;
                } else if (vote.getVoteType() == VoteType.DISLIKE) {
                    commentDislikeCount++;
                }

                if (currentUserId != null
                        && vote.getUser() != null
                        && currentUserId.equals(vote.getUser().getId())) {
                    if (vote.getVoteType() == VoteType.LIKE) {
                        commentLikedByCurrentUser = true;
                    } else if (vote.getVoteType() == VoteType.DISLIKE) {
                        commentDislikedByCurrentUser = true;
                    }
                }
            }

            cr.setId(comment.getId());
            cr.setUserId(comment.getUser().getId());
            cr.setUsername(comment.getUser().getUsername());
            cr.setUserProfilePicture(comment.getUser().getProfilePicture());
            cr.setPostId(post.getId());
            cr.setText(comment.getText());
            cr.setPictureUrl(comment.getPictureUrl());
            cr.setPostedAt(comment.getPostedAt());
            cr.setLikeCount(commentLikeCount);
            cr.setDislikeCount(commentDislikeCount);
            cr.setVoteCount(commentLikeCount - commentDislikeCount);
            cr.setLikedByCurrentUser(commentLikedByCurrentUser);
            cr.setDislikedByCurrentUser(commentDislikedByCurrentUser);

            commentResponses.add(cr);
        }
        sortCommentsByVotesDesc(commentResponses);
        response.setComments(commentResponses);

        long likeCount = 0;
        long dislikeCount = 0;
        boolean likedByCurrentUser = false;
        boolean dislikedByCurrentUser = false;

        for (PostVote vote : post.getVotes()) {
            if (vote.getVoteType() == VoteType.LIKE) {
                likeCount++;
            } else if (vote.getVoteType() == VoteType.DISLIKE) {
                dislikeCount++;
            }

            if (currentUserId != null
                    && vote.getUser() != null
                    && currentUserId.equals(vote.getUser().getId())) {
                if (vote.getVoteType() == VoteType.LIKE) {
                    likedByCurrentUser = true;
                } else if (vote.getVoteType() == VoteType.DISLIKE) {
                    dislikedByCurrentUser = true;
                }
            }
        }

        response.setLikeCount(likeCount);
        response.setDislikeCount(dislikeCount);
        response.setVoteCount(likeCount - dislikeCount);
        response.setLikedByCurrentUser(likedByCurrentUser);
        response.setDislikedByCurrentUser(dislikedByCurrentUser);

        return response;
    }

    public PostResponse closeComments(Long id, Long currentUserId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        if (!post.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized: You can only close comments on your own posts.");
        }

        post.setStatus(PostStatus.OUTDATED);
        Post updated = postRepository.save(post);
        return mapToResponse(updated, currentUserId);
    }

    private void sortCommentsByVotesDesc(List<CommentResponse> comments) {
        comments.sort((a, b) -> {
            int byVotes = Integer.compare(b.getVoteCount(), a.getVoteCount());
            if (byVotes != 0) {
                return byVotes;
            }

            if (a.getPostedAt() == null && b.getPostedAt() == null) {
                return 0;
            }
            if (a.getPostedAt() == null) {
                return 1;
            }
            if (b.getPostedAt() == null) {
                return -1;
            }

            return a.getPostedAt().compareTo(b.getPostedAt());
        });
    }

    private PostStatus resolveDisplayStatus(Post post, List<Comment> comments) {
        if (post.getStatus() == PostStatus.OUTDATED) {
            return PostStatus.OUTDATED;
        }

        if (comments != null && !comments.isEmpty()) {
            return PostStatus.FIRST_REACTIONS;
        }

        return PostStatus.JUST_POSTED;
    }

    private List<String> extractPictureUrls(List<Picture> pictures) {
        List<String> urls = new ArrayList<>();

        if (pictures != null) {
            for (Picture picture : pictures) {
                urls.add(picture.getPictureUrl());
            }
        }

        return urls;
    }

    public PostResponse update(Long id, PostRequest request, Long currentUserId) {
        Post existing = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        if (!existing.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized: You can only edit your own posts.");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateCaption(request.getCaption());
        validatePictureUrls(request.getPictureUrls());

        existing.setUser(user);
        existing.setLocation(request.getLocation());
        existing.setCaption(request.getCaption());
        existing.setTitle(resolveTitle(request));

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        existing.setTags(getOrCreateTags(request.getTagNames()));

        existing.clearPictures();
        addPicturesToPost(existing, request.getPictureUrls());

        Post updated = postRepository.save(existing);
        return mapToResponse(updated, request.getUserId());
    }
}

