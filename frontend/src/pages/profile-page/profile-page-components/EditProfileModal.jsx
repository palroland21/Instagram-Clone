function EditProfileModal({
                              avatarSrc,
                              editForm,
                              setEditForm,
                              profilePictureFile,
                              saveError,
                              isSaving,
                              fileInputRef,
                              onClose,
                              onFileChange,
                              onChangeProfilePicture,
                              onSave,
                          }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 16,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#262626',
                    borderRadius: 12,
                    width: '100%',
                    maxWidth: 400,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>
                        Edit Profile
                    </span>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#737373',
                            fontSize: 18,
                            cursor: 'pointer',
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={editForm.profilePicture || avatarSrc}
                        alt="preview"
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid #363636',
                        }}
                    />
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    style={{ display: 'none' }}
                />

                <button
                    type="button"
                    onClick={onChangeProfilePicture}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#363636',
                        border: '1px solid #4a4a4a',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Change profile picture
                </button>

                {profilePictureFile && (
                    <div
                        style={{
                            fontSize: 13,
                            color: '#b3b3b3',
                            textAlign: 'center',
                            marginTop: -8,
                        }}
                    >
                        Selected: {profilePictureFile.name}
                    </div>
                )}

                {saveError && (
                    <div
                        style={{
                            background: '#fdeaea',
                            color: '#b42318',
                            padding: '8px 12px',
                            borderRadius: 8,
                            fontSize: 13,
                        }}
                    >
                        {saveError}
                    </div>
                )}

                {[
                    { key: 'username', label: 'Username', multiline: false },
                    { key: 'fullName', label: 'Full name', multiline: false },
                    { key: 'bio', label: 'Bio', multiline: true },
                ].map(({ key, label, multiline }) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label
                            style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: '#f5f5f5',
                            }}
                        >
                            {label}
                        </label>

                        {multiline ? (
                            <textarea
                                value={editForm[key]}
                                onChange={e =>
                                    setEditForm(prev => ({
                                        ...prev,
                                        [key]: e.target.value,
                                    }))
                                }
                                rows={3}
                                style={{
                                    background: '#363636',
                                    border: '1px solid #4a4a4a',
                                    borderRadius: 8,
                                    color: 'white',
                                    fontSize: 14,
                                    padding: '10px 12px',
                                    outline: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    resize: 'vertical',
                                }}
                            />
                        ) : (
                            <input
                                value={editForm[key]}
                                onChange={e =>
                                    setEditForm(prev => ({
                                        ...prev,
                                        [key]: e.target.value,
                                    }))
                                }
                                style={{
                                    background: '#363636',
                                    border: '1px solid #4a4a4a',
                                    borderRadius: 8,
                                    color: 'white',
                                    fontSize: 14,
                                    padding: '10px 12px',
                                    outline: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            />
                        )}
                    </div>
                ))}

                <button
                    onClick={onSave}
                    disabled={isSaving}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: isSaving ? '#5aa7dd' : '#0095f6',
                        border: 'none',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: isSaving ? 'default' : 'pointer',
                        opacity: isSaving ? 0.85 : 1,
                    }}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    )
}

export default EditProfileModal