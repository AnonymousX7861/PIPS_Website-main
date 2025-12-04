// Admin Data Manager
// Manages Contact Info, Gallery Images, Notice Board, and Uniform Shop data

const AdminDataManager = {
    // Storage keys
    KEYS: {
        CONTACT: 'schoolContactInfo',
        GALLERY: 'schoolGalleryImages',
        NOTICE_BOARD: 'schoolNoticeBoard',
        UNIFORM_SHOP: 'schoolUniformShop'
    },

    // ============ CONTACT INFORMATION ============
    ContactInfo: {
        get: function() {
            try {
                const data = localStorage.getItem(AdminDataManager.KEYS.CONTACT);
                return data ? JSON.parse(data) : AdminDataManager.ContactInfo.getDefault();
            } catch (error) {
                console.error('Error reading contact info:', error);
                return AdminDataManager.ContactInfo.getDefault();
            }
        },

        getDefault: function() {
            return {
                email: 'pinetownindependentprimary@gmail.com',
                phone: '0748479786',
                address: {
                    street: '37 Hill Street',
                    city: 'Pinetown',
                    postal: '3610',
                    country: 'South Africa'
                },
                officeHours: [
                    { day: 'Mon-Fri', time: '7:30 AM - 3:30 PM' },
                    { day: 'Saturday', time: 'Closed' },
                    { day: 'Sunday', time: 'Closed' }
                ],
                schoolHours: [
                    { label: 'Classes', time: '8:00 AM - 2:30 PM' },
                    { label: 'After Care', time: '2:30 PM - 5:00 PM' },
                    { label: 'Drop-off', time: '7:00 AM - 8:00 AM' }
                ]
            };
        },

        save: function(data) {
            try {
                localStorage.setItem(AdminDataManager.KEYS.CONTACT, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Error saving contact info:', error);
                return false;
            }
        }
    },

    // ============ GALLERY IMAGES ============
    Gallery: {
        getAll: function() {
            try {
                const data = localStorage.getItem(AdminDataManager.KEYS.GALLERY);
                return data ? JSON.parse(data) : AdminDataManager.Gallery.getDefault();
            } catch (error) {
                console.error('Error reading gallery:', error);
                return AdminDataManager.Gallery.getDefault();
            }
        },

        getDefault: function() {
            return [
                { id: 1, src: '_images/events 1.jpg', alt: 'School Event 1', uploadDate: new Date().toLocaleString() },
                { id: 2, src: '_images/events 2.jpg', alt: 'School Event 2', uploadDate: new Date().toLocaleString() },
                { id: 3, src: '_images/events 3.jpg', alt: 'School Event 3', uploadDate: new Date().toLocaleString() },
                { id: 4, src: '_images/events 4.jpg', alt: 'School Event 4', uploadDate: new Date().toLocaleString() },
                { id: 5, src: '_images/events 5.jpg', alt: 'School Event 5', uploadDate: new Date().toLocaleString() },
                { id: 6, src: '_images/events 6.jpg', alt: 'School Event 6', uploadDate: new Date().toLocaleString() },
                { id: 7, src: '_images/events 7.jpg', alt: 'School Event 7', uploadDate: new Date().toLocaleString() },
                { id: 8, src: '_images/events 8.jpg', alt: 'School Event 8', uploadDate: new Date().toLocaleString() },
                { id: 9, src: '_images/events 9.jpg', alt: 'School Event 9', uploadDate: new Date().toLocaleString() },
                { id: 10, src: '_images/events 10.jpg', alt: 'School Event 10', uploadDate: new Date().toLocaleString() },
                { id: 11, src: '_images/teaches_photo 1.jpg', alt: 'Teachers Photo', uploadDate: new Date().toLocaleString() },
                { id: 12, src: '_images/awards 1.jpg', alt: 'Awards Ceremony', uploadDate: new Date().toLocaleString() },
                { id: 13, src: '_images/awards 2.jpg', alt: 'Awards Ceremony', uploadDate: new Date().toLocaleString() },
                { id: 14, src: '_images/awards 3.jpg', alt: 'Awards Ceremony', uploadDate: new Date().toLocaleString() },
                { id: 15, src: '_images/photo_day.jpg', alt: 'Photo Day Activities', uploadDate: new Date().toLocaleString() },
                { id: 16, src: '_images/classroom 1.jpg', alt: 'Classroom Environment', uploadDate: new Date().toLocaleString() },
                { id: 17, src: '_images/classroom 2.jpg', alt: 'Classroom Learning', uploadDate: new Date().toLocaleString() }
            ];
        },

        add: function(imageData) {
            try {
                const images = this.getAll();
                const newImage = {
                    id: Date.now(),
                    src: imageData.src,
                    alt: imageData.alt,
                    uploadDate: new Date().toLocaleString()
                };
                images.push(newImage);
                localStorage.setItem(AdminDataManager.KEYS.GALLERY, JSON.stringify(images));
                return newImage;
            } catch (error) {
                console.error('Error adding image:', error);
                return null;
            }
        },

        delete: function(imageId) {
            try {
                let images = this.getAll();
                images = images.filter(img => img.id !== imageId);
                localStorage.setItem(AdminDataManager.KEYS.GALLERY, JSON.stringify(images));
                return true;
            } catch (error) {
                console.error('Error deleting image:', error);
                return false;
            }
        }
    },

    // ============ NOTICE BOARD ============
    NoticeBoard: {
        getAll: function() {
            try {
                const data = localStorage.getItem(AdminDataManager.KEYS.NOTICE_BOARD);
                return data ? JSON.parse(data) : AdminDataManager.NoticeBoard.getDefault();
            } catch (error) {
                console.error('Error reading notice board:', error);
                return AdminDataManager.NoticeBoard.getDefault();
            }
        },

        getDefault: function() {
            return {
                events: [
                    { id: 1, text: 'Parent-Teacher Conference - March 15, 2025' },
                    { id: 2, text: 'School Sports Day - March 22, 2025' },
                    { id: 3, text: 'Grade 7 Graduation Ceremony - December 5, 2025' },
                    { id: 4, text: 'School Open Day - April 10, 2025' }
                ],
                news: [
                    { id: 1, text: 'New library books have arrived and are available for borrowing' },
                    { id: 2, text: 'School garden project wins district environmental award' },
                    { id: 3, text: 'Grade 6 students participate in mathematics olympiad' },
                    { id: 4, text: 'School choir performs at community festival' }
                ],
                reminders: [
                    { id: 1, text: 'School fees for Term 2 are due by March 31, 2025' },
                    { id: 2, text: 'Please ensure students wear proper school uniform daily' },
                    { id: 3, text: 'Parent permission slips for field trips must be submitted by Friday' },
                    { id: 4, text: 'After-school activities resume next Monday' }
                ]
            };
        },

        save: function(data) {
            try {
                localStorage.setItem(AdminDataManager.KEYS.NOTICE_BOARD, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Error saving notice board:', error);
                return false;
            }
        },

        addItem: function(category, text) {
            try {
                const data = this.getAll();
                const newItem = {
                    id: Date.now(),
                    text: text
                };
                data[category].push(newItem);
                return this.save(data) ? newItem : null;
            } catch (error) {
                console.error('Error adding notice item:', error);
                return null;
            }
        },

        deleteItem: function(category, itemId) {
            try {
                const data = this.getAll();
                data[category] = data[category].filter(item => item.id !== itemId);
                return this.save(data);
            } catch (error) {
                console.error('Error deleting notice item:', error);
                return false;
            }
        }
    },

    // ============ UNIFORM SHOP ============
    UniformShop: {
        getAll: function() {
            try {
                const data = localStorage.getItem(AdminDataManager.KEYS.UNIFORM_SHOP);
                return data ? JSON.parse(data) : AdminDataManager.UniformShop.getDefault();
            } catch (error) {
                console.error('Error reading uniform shop:', error);
                return AdminDataManager.UniformShop.getDefault();
            }
        },

        getDefault: function() {
            return {
                boys: {
                    summer: [
                        { id: 1, name: 'Navy blue shorts', price: 150 },
                        { id: 2, name: 'White short-sleeve shirt', price: 120 },
                        { id: 3, name: 'Navy blue knee-high socks', price: 45 },
                        { id: 4, name: 'Black school shoes', price: 280 },
                        { id: 5, name: 'Navy blue school hat', price: 85 }
                    ],
                    winter: [
                        { id: 6, name: 'Navy blue long pants', price: 180 },
                        { id: 7, name: 'White long-sleeve shirt', price: 140 },
                        { id: 8, name: 'Navy blue pullover', price: 220 },
                        { id: 9, name: 'Navy blue blazer', price: 350 },
                        { id: 10, name: 'School tie', price: 65 }
                    ],
                    sports: [
                        { id: 11, name: 'Navy blue sports shorts', price: 130 },
                        { id: 12, name: 'White sports t-shirt', price: 110 },
                        { id: 13, name: 'White sports socks', price: 40 },
                        { id: 14, name: 'Sports tracksuit', price: 380 }
                    ]
                },
                girls: {
                    summer: [
                        { id: 15, name: 'Navy blue tunic dress', price: 180 },
                        { id: 16, name: 'White short-sleeve blouse', price: 125 },
                        { id: 17, name: 'White knee-high socks', price: 45 },
                        { id: 18, name: 'Black school shoes', price: 280 },
                        { id: 19, name: 'Navy blue school hat', price: 85 }
                    ],
                    winter: [
                        { id: 20, name: 'Navy blue winter skirt', price: 160 },
                        { id: 21, name: 'White long-sleeve blouse', price: 145 },
                        { id: 22, name: 'Navy blue cardigan', price: 240 },
                        { id: 23, name: 'Navy blue blazer', price: 350 },
                        { id: 24, name: 'School tie', price: 65 }
                    ],
                    sports: [
                        { id: 25, name: 'Navy blue sports skort', price: 140 },
                        { id: 26, name: 'White sports t-shirt', price: 110 },
                        { id: 27, name: 'White sports socks', price: 40 },
                        { id: 28, name: 'Sports tracksuit', price: 380 }
                    ]
                }
            };
        },

        save: function(data) {
            try {
                localStorage.setItem(AdminDataManager.KEYS.UNIFORM_SHOP, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Error saving uniform shop:', error);
                return false;
            }
        },

        addItem: function(gender, category, itemData) {
            try {
                const data = this.getAll();
                const newItem = {
                    id: Date.now(),
                    name: itemData.name,
                    price: itemData.price
                };
                data[gender][category].push(newItem);
                return this.save(data) ? newItem : null;
            } catch (error) {
                console.error('Error adding uniform item:', error);
                return null;
            }
        },

        deleteItem: function(gender, category, itemId) {
            try {
                const data = this.getAll();
                data[gender][category] = data[gender][category].filter(item => item.id !== itemId);
                return this.save(data);
            } catch (error) {
                console.error('Error deleting uniform item:', error);
                return false;
            }
        },

        updateItem: function(gender, category, itemId, updates) {
            try {
                const data = this.getAll();
                const itemIndex = data[gender][category].findIndex(item => item.id === itemId);
                if (itemIndex !== -1) {
                    data[gender][category][itemIndex] = { 
                        ...data[gender][category][itemIndex], 
                        ...updates 
                    };
                    return this.save(data);
                }
                return false;
            } catch (error) {
                console.error('Error updating uniform item:', error);
                return false;
            }
        }
    }
};
