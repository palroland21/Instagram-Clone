package com.instagram.clone.service;

import com.instagram.clone.dto.request.PostRequest;
import com.instagram.clone.dto.response.CommentResponse;
import com.instagram.clone.dto.response.PostResponse;
import com.instagram.clone.model.Comment;
import com.instagram.clone.model.Picture;
import com.instagram.clone.model.Post;
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

        validatePictureUrls(request.getPictureUrls());

        Post post = new Post();
        post.setUser(user);
        post.setLocation(request.getLocation());
        post.setCaption(request.getCaption());
        post.setTitle(request.getTitle());
        post.setCreatedAt(LocalDateTime.now());
        post.setStatus(request.getStatus() != null ? request.getStatus() : PostStatus.JUST_POSTED);
        post.setTags(getOrCreateTags(request.getTagNames()));

        addPicturesToPost(post, request.getPictureUrls());

        Post saved = postRepository.save(post);
        return mapToResponse(saved, request.getUserId());
    }

    public PostResponse getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return mapToResponse(post, null);
    }

    public List<PostResponse> getAll() {
        List<PostResponse> responses = new ArrayList<>();
        for (Post post : postRepository.findAll()) {
            responses.add(mapToResponse(post, null));
        }
        return responses;
    }

    public List<PostResponse> getAll(Long currentUserId) {
        List<PostResponse> responses = new ArrayList<>();
        for (Post post : postRepository.findAll()) {
            responses.add(mapToResponse(post, currentUserId));
        }
        return responses;
    }

    public PostResponse update(Long id, PostRequest request) {
        Post existing = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        validatePictureUrls(request.getPictureUrls());

        existing.setUser(user);
        existing.setLocation(request.getLocation());
        existing.setCaption(request.getCaption());
        existing.setTitle(request.getTitle());

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        existing.setTags(getOrCreateTags(request.getTagNames()));

        existing.clearPictures();
        addPicturesToPost(existing, request.getPictureUrls());

        Post updated = postRepository.save(existing);
        return mapToResponse(updated, request.getUserId());
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    private void validatePictureUrls(List<String> pictureUrls) {
        if (pictureUrls == null || pictureUrls.isEmpty()) {
            throw new RuntimeException("A post must contain at least one picture.");
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

        if (tagNames != null) {
            for (String tagName : tagNames) {
                if (tagName == null || tagName.trim().isEmpty()) {
                    continue;
                }

                String cleanTagName = tagName.trim().toLowerCase();

                Tag tag = tagRepository.findByName(cleanTagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(cleanTagName);
                            return tagRepository.save(newTag);
                        });

                tags.add(tag);
            }
        }

        return tags;
    }

    private PostResponse mapToResponse(Post post, Long currentUserId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setUserId(post.getUser().getId());
        response.setUsername(post.getUser().getUsername());
        response.setPictureUrls(extractPictureUrls(post.getPictures()));
        response.setLocation(post.getLocation());
        response.setCaption(post.getCaption());
        response.setTitle(post.getTitle());
        response.setCreatedAt(post.getCreatedAt());
        response.setStatus(post.getStatus());

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

        List<Comment> comments = commentRepository.findByPostId(post.getId());
        List<CommentResponse> commentResponses = new ArrayList<>();
        for (Comment comment : comments) {
            CommentResponse cr = new CommentResponse();
            cr.setId(comment.getId());
            cr.setUserId(comment.getUser().getId());
            cr.setUsername(comment.getUser().getUsername());
            cr.setPostId(post.getId());
            cr.setText(comment.getText());
            cr.setPictureUrl(comment.getPictureUrl());
            cr.setPostedAt(comment.getPostedAt());
            commentResponses.add(cr);
        }
        response.setComments(commentResponses);

        long likeCount = postVoteRepository.countByPostIdAndVoteType(post.getId(), VoteType.LIKE);
        response.setLikeCount(likeCount);

        if (currentUserId != null) {
            boolean liked = postVoteRepository.findByUserIdAndPostId(currentUserId, post.getId())
                    .map(v -> v.getVoteType() == VoteType.LIKE)
                    .orElse(false);
            response.setLikedByCurrentUser(liked);
        } else {
            response.setLikedByCurrentUser(false);
        }

        return response;
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
}