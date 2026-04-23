package com.instagram.clone.service;

import com.instagram.clone.dto.response.PostVoteResponse;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.PostVoteRepository;
import com.instagram.clone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostVoteService {

    private final PostVoteRepository postVoteRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public Map<String, Object> toggleLike(Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        var existingVote = postVoteRepository.findByUserIdAndPostId(userId, postId);

        if (existingVote.isPresent()) {
            PostVote vote = existingVote.get();

            if (vote.getVoteType() == VoteType.LIKE) {
                postVoteRepository.delete(vote);

                Map<String, Object> response = new HashMap<>();
                response.put("liked", false);
                response.put("likeCount", getLikeCount(postId));
                return response;
            } else {
                vote.setVoteType(VoteType.LIKE);
                postVoteRepository.save(vote);

                Map<String, Object> response = new HashMap<>();
                response.put("liked", true);
                response.put("likeCount", getLikeCount(postId));
                return response;
            }
        }

        PostVote newVote = new PostVote();
        newVote.setUser(user);
        newVote.setPost(post);
        newVote.setVoteType(VoteType.LIKE);
        postVoteRepository.save(newVote);

        Map<String, Object> response = new HashMap<>();
        response.put("liked", true);
        response.put("likeCount", getLikeCount(postId));
        return response;
    }

    public long getLikeCount(Long postId) {
        return postVoteRepository.countByPostIdAndVoteType(postId, VoteType.LIKE);
    }

    public boolean isLikedByUser(Long userId, Long postId) {
        return postVoteRepository.findByUserIdAndPostId(userId, postId)
                .map(v -> v.getVoteType() == VoteType.LIKE)
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
}