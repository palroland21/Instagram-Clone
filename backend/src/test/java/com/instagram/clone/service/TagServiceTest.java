package com.instagram.clone.service;

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
        // GIVEN
        Tag tag = new Tag();
        tag.setName("#spring_boot");

        when(tagRepository.save(any(Tag.class))).thenReturn(tag);

        // WHEN
        Tag saved = tagService.create(tag);

        // THEN
        assertNotNull(saved, "Tag-ul salvat nu ar trebui să fie null");
        assertEquals("#spring_boot", saved.getName());
    }
}