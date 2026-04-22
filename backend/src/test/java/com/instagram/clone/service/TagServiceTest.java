package com.instagram.clone.service;

import com.instagram.clone.dto.request.TagRequest;
import com.instagram.clone.dto.response.TagResponse;
import com.instagram.clone.model.Tag;
import com.instagram.clone.repository.TagRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TagServiceTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private TagService tagService;

    @Test
    void create_ShouldReturnSavedTag() {
        TagRequest tagRequest = new TagRequest();
        tagRequest.setName("#spring_boot");

        Tag savedTag = new Tag();
        savedTag.setId(1L);
        savedTag.setName("#spring_boot");

        when(tagRepository.save(any(Tag.class))).thenReturn(savedTag);

        TagResponse result = tagService.create(tagRequest);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("#spring_boot", result.getName());
    }
}