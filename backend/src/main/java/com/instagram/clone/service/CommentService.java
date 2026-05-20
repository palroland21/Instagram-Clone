package com.instagram.clone.service;

import com.instagram.clone.dto.request.CommentRequest;
import com.instagram.clone.dto.response.CommentResponse;
import com.instagram.clone.model.Comment;
import com.instagram.clone.model.CommentVote;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.PostStatus;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.repository.CommentRepository;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository,
                          UserRepository userRepository,
                          PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public CommentResponse create(CommentRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getStatus() == PostStatus.OUTDATED) {
            throw new RuntimeException("Comments are closed for this post.");
        }

        validateText(request.getText());

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setText(request.getText());
        comment.setPictureUrl(request.getPictureUrl());
        comment.setPostedAt(request.getPostedAt() != null ? request.getPostedAt() : LocalDateTime.now());

        Comment saved = commentRepository.save(comment);

        if (post.getStatus() == PostStatus.JUST_POSTED) {
            post.setStatus(PostStatus.FIRST_REACTIONS);
            postRepository.save(post);
        }

        return mapToResponse(saved, request.getUserId());
    }

    public CommentResponse getById(Long id, Long currentUserId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return mapToResponse(comment, currentUserId);
    }

    public List<CommentResponse> getAll(Long currentUserId) {
        List<CommentResponse> responses = new ArrayList<>();

        for (Comment comment : commentRepository.findAll()) {
            responses.add(mapToResponse(comment, currentUserId));
        }

        sortByVotesDesc(responses);
        return responses;
    }

    public List<CommentResponse> getByPostId(Long postId, Long currentUserId) {
        List<CommentResponse> responses = new ArrayList<>();

        for (Comment comment : commentRepository.findByPostId(postId)) {
            responses.add(mapToResponse(comment, currentUserId));
        }

        sortByVotesDesc(responses);
        return responses;
    }

    public CommentResponse update(Long id, CommentRequest request) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only edit your own comments.");
        }

        validateText(request.getText());

        comment.setText(request.getText());
        if (request.getPictureUrl() != null) {
            comment.setPictureUrl(request.getPictureUrl());
        }
        comment.setPostedAt(request.getPostedAt() != null ? request.getPostedAt() : comment.getPostedAt());

        Comment updated = commentRepository.save(comment);
        return mapToResponse(updated, request.getUserId());
    }

    public void delete(Long id, Long currentUserId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own comments.");
        }

        commentRepository.delete(comment);
    }

    public void delete(Long id) {
        commentRepository.deleteById(id);
    }

    private void validateText(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new RuntimeException("A comment must contain text.");
        }
    }

    private void sortByVotesDesc(List<CommentResponse> responses) {
        responses.sort((a, b) -> {
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

    private CommentResponse mapToResponse(Comment comment, Long currentUserId) {
        CommentResponse response = new CommentResponse();

        int likeCount = 0;
        int dislikeCount = 0;
        boolean likedByCurrentUser = false;
        boolean dislikedByCurrentUser = false;

        for (CommentVote vote : comment.getVotes()) {
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

        response.setId(comment.getId());
        response.setUserId(comment.getUser().getId());
        response.setUsername(comment.getUser().getUsername());
        response.setUserProfilePicture(comment.getUser().getProfilePicture());
        response.setPostId(comment.getPost().getId());
        response.setText(comment.getText());
        response.setPictureUrl(comment.getPictureUrl());
        response.setPostedAt(comment.getPostedAt());
        response.setAuthorScore(comment.getUser().getScore());

        response.setLikeCount(likeCount);
        response.setDislikeCount(dislikeCount);
        response.setVoteCount(likeCount - dislikeCount);

        response.setLikedByCurrentUser(likedByCurrentUser);
        response.setDislikedByCurrentUser(dislikedByCurrentUser);

        return response;
    }
}
