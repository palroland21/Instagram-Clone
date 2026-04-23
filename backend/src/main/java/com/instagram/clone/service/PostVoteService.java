package com.instagram.clone.service;

import com.instagram.clone.dto.response.PostVoteToggleResponse;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.PostVoteRepository;
import com.instagram.clone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostVoteService {

    private final PostVoteRepository postVoteRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public PostVoteToggleResponse toggleVote(Long userId, Long postId, VoteType voteType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<PostVote> existingVote = postVoteRepository.findByUserIdAndPostId(userId, postId);

        if (existingVote.isPresent()) {
            PostVote vote = existingVote.get();

            if (vote.getVoteType() == voteType) {
                postVoteRepository.delete(vote);
            } else {
                vote.setVoteType(voteType);
                postVoteRepository.save(vote);
            }
        } else {
            PostVote newVote = new PostVote();
            newVote.setUser(user);
            newVote.setPost(post);
            newVote.setVoteType(voteType);
            postVoteRepository.save(newVote);
        }

        return buildToggleResponse(userId, postId);
    }

    public long getLikeCount(Long postId) {
        return postVoteRepository.countByPostIdAndVoteType(postId, VoteType.LIKE);
    }

    public long getDislikeCount(Long postId) {
        return postVoteRepository.countByPostIdAndVoteType(postId, VoteType.DISLIKE);
    }

    public long getVoteCount(Long postId) {
        return getLikeCount(postId) - getDislikeCount(postId);
    }

    public boolean isLikedByUser(Long userId, Long postId) {
        return postVoteRepository.findByUserIdAndPostId(userId, postId)
                .map(v -> v.getVoteType() == VoteType.LIKE)
                .orElse(false);
    }

    public boolean isDislikedByUser(Long userId, Long postId) {
        return postVoteRepository.findByUserIdAndPostId(userId, postId)
                .map(v -> v.getVoteType() == VoteType.DISLIKE)
                .orElse(false);
    }

    private PostVoteToggleResponse buildToggleResponse(Long userId, Long postId) {
        long likeCount = getLikeCount(postId);
        long dislikeCount = getDislikeCount(postId);

        Optional<PostVote> currentVote = postVoteRepository.findByUserIdAndPostId(userId, postId);

        boolean liked = currentVote.isPresent() && currentVote.get().getVoteType() == VoteType.LIKE;
        boolean disliked = currentVote.isPresent() && currentVote.get().getVoteType() == VoteType.DISLIKE;

        PostVoteToggleResponse response = new PostVoteToggleResponse();
        response.setUserId(userId);
        response.setPostId(postId);
        response.setLiked(liked);
        response.setDisliked(disliked);
        response.setLikeCount(likeCount);
        response.setDislikeCount(dislikeCount);
        response.setVoteCount(likeCount - dislikeCount);

        return response;
    }
}