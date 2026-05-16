export const CURRENT_USER = {
    username: 'yourprofile',
    fullName: 'Your Name',
    avatar: 'https://i.pravatar.cc/150?img=1',
}

export const STORIES = [
    { id: 1, username: 'ac.utcluj.ro', avatar: 'https://i.pravatar.cc/150?img=2', seen: false },
    { id: 2, username: 'bmwtech...', avatar: 'https://i.pravatar.cc/150?img=3', seen: false },
    { id: 3, username: 'gdg_utcn', avatar: 'https://i.pravatar.cc/150?img=4', seen: false },
    { id: 4, username: 'nadett777', avatar: 'https://i.pravatar.cc/150?img=5', seen: false },
    { id: 5, username: 'selly', avatar: 'https://i.pravatar.cc/150?img=6', seen: true },
    { id: 6, username: 'tania_doici...', avatar: 'https://i.pravatar.cc/150?img=7', seen: true },
    { id: 7, username: 'mario_xyz', avatar: 'https://i.pravatar.cc/150?img=8', seen: false },
    { id: 8, username: 'elena.pop', avatar: 'https://i.pravatar.cc/150?img=9', seen: false },
]

export const POSTS = [
    {
        id: 1,
        username: 'alessiioo.tsc',
        avatar: 'https://i.pravatar.cc/150?img=10',
        location: 'Stuttgart, Germany',
        timeAgo: '1d',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
        likes: 247,
        caption: 'Road trip vibes 🚗✨',
        comments: [
            { username: 'john_doe', text: 'Amazing shot!' },
            { username: 'maria.k', text: 'Looks so good 😍' },
        ],
        liked: false,
        saved: false,
    },
    {
        id: 2,
        username: 'travel.world',
        avatar: 'https://i.pravatar.cc/150?img=11',
        location: 'Santorini, Greece',
        timeAgo: '3h',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
        likes: 1832,
        caption: 'Blue domes and sunsets forever 🌅🇬🇷 #santorini #greece #travel',
        comments: [
            { username: 'alex99', text: 'Dream destination!' },
            { username: 'laura.m', text: 'I need to go there ASAP' },
        ],
        liked: true,
        saved: false,
    },
    {
        id: 3,
        username: 'food.corner',
        avatar: 'https://i.pravatar.cc/150?img=12',
        location: 'Rome, Italy',
        timeAgo: '6h',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
        likes: 589,
        caption: 'Best pasta in the world, no debate 🍝❤️ #italianfood #rome',
        comments: [
            { username: 'chef_mark', text: 'Carbonara is life' },
            { username: 'nina_foodie', text: '😋😋😋' },
        ],
        liked: false,
        saved: true,
    },
]

export const SUGGESTIONS = [
    { id: 1, username: 'Diana', mutualInfo: 'Followed by anghelusalin', avatar: 'https://i.pravatar.cc/150?img=20' },
    { id: 2, username: 'Reka Bundas', mutualInfo: 'Followed by jonuczdenisza +', avatar: 'https://i.pravatar.cc/150?img=21' },
    { id: 3, username: 'Hintalan Eva', mutualInfo: 'Following magdalena.pal.18', avatar: 'https://i.pravatar.cc/150?img=22' },
    { id: 4, username: 'Vinkler Vivi', mutualInfo: 'Followed by jonuczdenisza +', avatar: 'https://i.pravatar.cc/150?img=23' },
    { id: 5, username: 'Alex', mutualInfo: 'Followed by ciutanariana + 3', avatar: 'https://i.pravatar.cc/150?img=24' },
]