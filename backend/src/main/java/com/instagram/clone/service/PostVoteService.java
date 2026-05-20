package com.instagram.clone.service;

import com.instagram.clone.dto.response.PostVoteResponse;
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

import java.util.List;
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

        if (post.getUser().getId().equals(userId)) {
            throw new RuntimeException("You cannot vote on your own post.");
        }

        User author = post.getUser();
        Optional<PostVote> existingVote = postVoteRepository.findByUserIdAndPostId(userId, postId);

        if (existingVote.isPresent()) {
            PostVote vote = existingVote.get();

            if (vote.getVoteType() == voteType) {
                if (voteType == VoteType.LIKE) author.setScore(author.getScore() - 2.5);
                else author.setScore(author.getScore() + 1.5);
                postVoteRepository.delete(vote);
            } else {
                if (vote.getVoteType() == VoteType.LIKE) {
                    author.setScore(author.getScore() - 2.5 - 1.5);
                } else {
                    author.setScore(author.getScore() + 1.5 + 2.5);
                }
                vote.setVoteType(voteType);
                postVoteRepository.save(vote);
            }
        } else {
            if (voteType == VoteType.LIKE) author.setScore(author.getScore() + 2.5);
            else author.setScore(author.getScore() - 1.5);

            PostVote newVote = new PostVote();
            newVote.setUser(user);
            newVote.setPost(post);
            newVote.setVoteType(voteType);
            postVoteRepository.save(newVote);
        }

        userRepository.save(author);
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

    public List<PostVoteResponse> getAll() {
        return ((List<PostVote>) postVoteRepository.findAll())
                .stream()
                .map(vote -> new PostVoteResponse(
                        vote.getId(),
                        vote.getUser().getId(),
                        vote.getPost().getId(),
                        vote.getVoteType()
                ))
                .toList();
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