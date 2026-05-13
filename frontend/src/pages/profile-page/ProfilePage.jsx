import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CreatePostModal from '../../components/create-post/CreatePostModal';
import EditProfileModal from './profile-page-components/EditProfileModal';
import FollowModal from './profile-page-components/FollowModal';
import PostsGrid from './profile-page-components/PostsGrid';
import ProfileHeader from './profile-page-components/ProfileHeader';
import ProfileInfo from './profile-page-components/ProfileInfo';
import SelectedPostModal from './profile-page-components/SelectedPostModal';
import useEditProfile from './profile-page-hooks/useEditProfile';
import useProfileData from './profile-page-hooks/useProfileData';
import useProfileFollow from './profile-page-hooks/useProfileFollow';
import { getPostImages } from './profileUtils';

function ProfilePage() {
    const navigate = useNavigate();
    const { targetUsername } = useParams();
    const [selectedPost, setSelectedPost] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const {
        addCreatedPost,
        currentUserId,
        isOwner,
        loading,
        posts,
        setUser,
        user,
    } = useProfileData({ navigate, targetUsername });

    const {
        closeFollowModal,
        followersCount,
        followingCount,
        followModalType,
        followUsers,
        handleToggleFollow,
        isFollowing,
        loadingFollow,
        openFollowModal,
    } = useProfileFollow({ currentUserId, user });

    const {
        closeEditModal,
        editForm,
        editing,
        fileInputRef,
        handleProfilePictureButtonClick,
        handleProfilePictureFileChange,
        handleSave,
        isSaving,
        openEditModal,
        profilePictureFile,
        saveError,
        setEditForm,
    } = useEditProfile({ setUser, user });

    const handlePostCreated = newPost => {
        addCreatedPost(newPost);
        setShowCreateModal(false);
    };

    if (loading) {
        return (
            <div
                style={{
                    background: '#000',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ color: '#737373', fontSize: 14 }}>
                    Loading...
                </div>
            </div>
        );
    }

    if (!user) return null;

    const avatarSrc =
        user.profilePicture ||
        `https://i.pravatar.cc/150?u=${user.id}`;

    return (
        <div style={{ background: '#000', minHeight: '100vh', color: 'white' }}>
            <ProfileHeader
                username={user.username}
                onBack={() => navigate('/home')}
                onAddPost={isOwner ? () => setShowCreateModal(true) : null}
            />

            <div
                style={{
                    maxWidth: 935,
                    margin: '0 auto',
                    padding: '24px 16px 0',
                }}
            >
                <ProfileInfo
                    user={user}
                    postsCount={posts.length}
                    followersCount={followersCount}
                    followingCount={followingCount}
                    avatarSrc={avatarSrc}
                    isOwner={isOwner}
                    isFollowing={isFollowing}
                    onToggleFollow={handleToggleFollow}
                    onMessage={() => alert('Chat-ul inca nu este implementat.')}
                    onOpenFollowers={() => openFollowModal('followers')}
                    onOpenFollowing={() => openFollowModal('following')}
                    onEditProfile={openEditModal}
                />

                <PostsGrid
                    posts={posts}
                    getPostImages={getPostImages}
                    onPostClick={post => setSelectedPost(post)}
                />
            </div>

            {isOwner && editing && (
                <EditProfileModal
                    avatarSrc={avatarSrc}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    profilePictureFile={profilePictureFile}
                    saveError={saveError}
                    isSaving={isSaving}
                    fileInputRef={fileInputRef}
                    onClose={closeEditModal}
                    onFileChange={handleProfilePictureFileChange}
                    onChangeProfilePicture={handleProfilePictureButtonClick}
                    onSave={handleSave}
                />
            )}

            {followModalType && (
                <FollowModal
                    followModalType={followModalType}
                    followUsers={followUsers}
                    loadingFollow={loadingFollow}
                    onClose={closeFollowModal}
                />
            )}

            {showCreateModal && (
                <CreatePostModal
                    onClose={() => setShowCreateModal(false)}
                    onPostCreated={handlePostCreated}
                />
            )}

            <SelectedPostModal
                post={selectedPost}
                currentUserId={currentUserId}
                onClose={() => setSelectedPost(null)}
            />
        </div>
    );
}

export default ProfilePage;
