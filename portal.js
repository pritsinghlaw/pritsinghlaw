// Law Offices of Pritpal Singh - Client Portal Application
class LawPortalApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.data = this.initializeData();
        this.init();
    }

    // Initialize application data based on provided JSON
    initializeData() {
        return {
            firmInfo: {
                name: "Law Offices of Pritpal Singh",
                copyright: "© 2025, Law Offices of Pritpal Singh",
                logoPlaceholder: "https://via.placeholder.com/150x50/1e3a8a/ffffff?text=Law+Offices+of+Pritpal+Singh"
            },
            user: {
                name: "Sarah Johnson",
                email: "sarah.johnson@email.com",
                role: "Client",
                avatar: "https://via.placeholder.com/40x40/1e3a8a/ffffff?text=SJ",
                memberSince: "January 2024"
            },
            dashboardMetrics: [
                {"title": "Active Cases", "value": "3", "change": "+1", "icon": "briefcase", "color": "navy"},
                {"title": "Documents Pending", "value": "7", "change": "-2", "icon": "document", "color": "orange"},
                {"title": "Messages", "value": "12", "change": "+5", "icon": "message", "color": "navy"},
                {"title": "Upcoming Deadlines", "value": "2", "change": "0", "icon": "calendar", "color": "orange"}
            ],
            cases: [
                {
                    id: "RE-2024-001",
                    title: "Property Purchase - 123 Main St",
                    type: "Real Estate Purchase",
                    status: "In Progress",
                    progress: 75,
                    attorney: "Pritpal Singh",
                    nextDeadline: "August 15, 2025",
                    lastActivity: "Document review completed",
                    client: "Sarah Johnson",
                    propertyAddress: "123 Main Street, Denver, CO 80202",
                    purchasePrice: "$450,000",
                    closingDate: "August 15, 2025"
                },
                {
                    id: "RE-2024-002", 
                    title: "Commercial Lease Agreement",
                    type: "Commercial Real Estate",
                    status: "Under Review",
                    progress: 45,
                    attorney: "Associate Attorney",
                    nextDeadline: "August 5, 2025",
                    lastActivity: "Lease terms negotiation",
                    client: "Sarah Johnson",
                    propertyAddress: "456 Business Plaza, Suite 200",
                    leaseTerms: "5 years with renewal option"
                },
                {
                    id: "RE-2024-003",
                    title: "Property Sale - 456 Oak Ave",
                    type: "Real Estate Sale",
                    status: "Closing Scheduled",
                    progress: 90,
                    attorney: "Pritpal Singh",
                    nextDeadline: "July 30, 2025",
                    lastActivity: "Final walkthrough scheduled",
                    client: "Sarah Johnson",
                    propertyAddress: "456 Oak Avenue, Boulder, CO 80301",
                    salePrice: "$320,000"
                }
            ],
            recentDocuments: [
                {"name": "Purchase Agreement", "type": "Contract", "date": "July 25, 2025", "status": "Signed", "size": "2.1 MB", "category": "contracts"},
                {"name": "Property Disclosure", "type": "Disclosure", "date": "July 24, 2025", "status": "Under Review", "size": "1.8 MB", "category": "disclosures"},
                {"name": "Title Report", "type": "Title Document", "date": "July 23, 2025", "status": "Received", "size": "3.2 MB", "category": "title"},
                {"name": "Inspection Report", "type": "Report", "date": "July 22, 2025", "status": "Pending Review", "size": "4.1 MB", "category": "reports"}
            ],
            recentMessages: [
                {"from": "Pritpal Singh", "subject": "Closing Date Confirmation", "date": "July 27, 2025", "preview": "The closing for 123 Main St has been confirmed for July 30th at 2:00 PM...", "unread": true, "priority": "normal"},
                {"from": "Sarah Johnson", "subject": "Document Question", "date": "July 26, 2025", "preview": "I have a question about the property disclosure form...", "unread": false, "priority": "normal"},
                {"from": "Title Company", "subject": "Title Insurance Update", "date": "July 25, 2025", "preview": "Your title insurance policy has been updated with the latest information...", "unread": false, "priority": "normal"}
            ],
            upcomingTasks: [
                {"id": 1, "task": "Sign final closing documents", "deadline": "July 30, 2025", "priority": "High", "completed": false},
                {"id": 2, "task": "Complete property walkthrough", "deadline": "July 29, 2025", "priority": "Medium", "completed": false},
                {"id": 3, "task": "Submit financing documents", "deadline": "August 5, 2025", "priority": "Medium", "completed": false},
                {"id": 4, "task": "Review lease agreement", "deadline": "August 10, 2025", "priority": "Low", "completed": false}
            ],
            paymentHistory: [
                {"invoice": "INV-2024-001", "amount": "$2,500.00", "date": "July 15, 2025", "status": "Paid", "description": "Legal Services - Property Purchase"},
                {"invoice": "INV-2024-002", "amount": "$1,200.00", "date": "June 30, 2025", "status": "Paid", "description": "Document Review and Preparation"},
                {"invoice": "INV-2024-003", "amount": "$800.00", "date": "August 1, 2025", "status": "Pending", "description": "Closing Services"}
            ],
            navigationItems: [
                {"name": "Dashboard", "icon": "home", "active": true},
                {"name": "Cases", "icon": "briefcase", "active": false},
                {"name": "Documents", "icon": "document", "active": false},
                {"name": "Messages", "icon": "message", "active": false},
                {"name": "Payments", "icon": "credit-card", "active": false},
                {"name": "Calendar", "icon": "calendar", "active": false},
                {"name": "Profile", "icon": "user", "active": false},
                {"name": "Settings", "icon": "cog", "active": false}
            ]
        };
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.generateImplementationGuide();
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation - Fixed to properly handle clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
                e.preventDefault();  // Prevent default behavior
                const navLink = e.target.matches('.nav-link') ? e.target : e.target.closest('.nav-link');
                const section = navLink.dataset.section;
                if (section) {
                    this.navigateToSection(section);
                }
            }
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Create task button - Fixed to properly open modal
        const createTaskBtn = document.getElementById('createTaskBtn');
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTaskModal();
            });
        }

        // Task form submission
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleTaskSubmission(e));
        }

        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-close') || e.target.closest('.modal-close') ||
                e.target.matches('.modal-cancel') || e.target.closest('.modal-cancel')) {
                e.preventDefault();
                this.closeAllModals();
            }
            if (e.target.matches('.modal-overlay')) {
                this.closeAllModals();
            }
        });

        // Task checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.id.startsWith('task')) {
                this.handleTaskToggle(e.target);
            }
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Notification button
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotifications();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // View All buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn') && e.target.textContent.includes('View All')) {
                e.preventDefault();
                const widgetHeader = e.target.closest('.widget-header');
                if (widgetHeader) {
                    const widgetTitle = widgetHeader.querySelector('h3').textContent.toLowerCase();
                    if (widgetTitle.includes('cases')) {
                        this.navigateToSection('cases');
                    } else if (widgetTitle.includes('messages')) {
                        this.navigateToSection('messages');
                    } else if (widgetTitle.includes('tasks')) {
                        this.navigateToSection('calendar'); // Tasks are shown in calendar
                    } else if (widgetTitle.includes('payment')) {
                        this.navigateToSection('payments');
                    }
                }
            }
        });
    }

    // Navigate to different sections - Fixed to ensure proper section switching
    navigateToSection(sectionName) {
        console.log(`Navigating to: ${sectionName}`); // Debug log
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section or create it if it doesn't exist
        let targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            // Create the section if it doesn't exist
            targetSection = document.createElement('section');
            targetSection.id = sectionName;
            targetSection.className = 'content-section active';
            document.querySelector('.main-content').appendChild(targetSection);
        }

        this.currentSection = sectionName;

        // Update section title
        const sectionTitle = document.getElementById('sectionTitle');
        if (sectionTitle) {
            sectionTitle.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
        }

        // Load section content
        this.loadSectionContent(sectionName);
        
        // Close mobile menu
        this.closeMobileMenu();
    }

    // Load content for specific sections - Fixed to properly populate sections
    loadSectionContent(sectionName) {
        const section = document.getElementById(sectionName);
        if (!section) return;

        // Clear existing content
        section.innerHTML = '';

        switch (sectionName) {
            case 'cases':
                this.loadCasesSection(section);
                break;
            case 'documents':
                this.loadDocumentsSection(section);
                break;
            case 'messages':
                this.loadMessagesSection(section);
                break;
            case 'payments':
                this.loadPaymentsSection(section);
                break;
            case 'calendar':
                this.loadCalendarSection(section);
                break;
            case 'profile':
                this.loadProfileSection(section);
                break;
            case 'settings':
                this.loadSettingsSection(section);
                break;
            default:
                section.innerHTML = `
                    <div class="section-header">
                        <div>
                            <h2>${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</h2>
                            <p>This section is under development.</p>
                        </div>
                    </div>
                `;
        }
    }

    // Load Cases Section
    loadCasesSection(section) {
        section.innerHTML = `
            <div class="section-header">
                <div>
                    <h2>Case Management</h2>
                    <p>Track the progress of all your legal matters</p>
                </div>
                <button class="btn btn--primary">
                    <i class="fas fa-plus"></i>
                    New Case
                </button>
            </div>
            
            <div class="cases-grid">
                ${this.data.cases.map(caseItem => `
                    <div class="case-card">
                        <div class="case-card-header">
                            <div class="case-badge">${caseItem.id}</div>
                            <span class="status status--${this.getStatusClass(caseItem.status)}">${caseItem.status}</span>
                        </div>
                        <div class="case-card-body">
                            <h3>${caseItem.title}</h3>
                            <p class="case-type">${caseItem.type}</p>
                            <div class="case-details">
                                <div class="detail-row">
                                    <span class="detail-label">Attorney:</span>
                                    <span class="detail-value">${caseItem.attorney}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Next Deadline:</span>
                                    <span class="detail-value">${caseItem.nextDeadline}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Property:</span>
                                    <span class="detail-value">${caseItem.propertyAddress || 'N/A'}</span>
                                </div>
                            </div>
                            <div class="case-progress">
                                <div class="progress-header">
                                    <span>Progress</span>
                                    <span>${caseItem.progress}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${caseItem.progress}%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="case-card-footer">
                            <button class="btn btn--outline btn--sm">View Details</button>
                            <button class="btn btn--primary btn--sm">Update Status</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Load Documents Section
    loadDocumentsSection(section) {
        section.innerHTML = `
            <div class="section-header">
                <div>
                    <h2>Document Management</h2>
                    <p>Access and manage all your legal documents</p>
                </div>
                <button class="btn btn--primary">
                    <i class="fas fa-upload"></i>
                    Upload Document
                </button>
            </div>
            
            <div class="documents-filters">
                <div class="search-bar">
                    <input type="search" class="form-control" placeholder="Search documents...">
                    <i class="fas fa-search"></i>
                </div>
                <select class="form-control">
                    <option value="">All Categories</option>
                    <option value="contracts">Contracts</option>
                    <option value="reports">Reports</option>
                    <option value="disclosures">Disclosures</option>
                    <option value="title">Title Documents</option>
                </select>
            </div>
            
            <div class="documents-grid">
                ${this.data.recentDocuments.map(doc => `
                    <div class="document-card">
                        <div class="document-icon">
                            <i class="fas fa-file-pdf"></i>
                        </div>
                        <div class="document-info">
                            <h4>${doc.name}</h4>
                            <p class="document-meta">${doc.type} • ${doc.size} • ${doc.date}</p>
                            <span class="status status--${this.getStatusClass(doc.status)}">${doc.status}</span>
                        </div>
                        <div class="document-actions">
                            <button class="btn btn--outline btn--sm" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn--outline btn--sm" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn btn--outline btn--sm" title="Share">
                                <i class="fas fa-share"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Load Messages Section
    loadMessagesSection(section) {
        section.innerHTML = `
            <div class="section-header">
                <div>
                    <h2>Messages</h2>
                    <p>Communicate securely with your legal team</p>
                </div>
                <button class="btn btn--primary">
                    <i class="fas fa-plus"></i>
                    Compose Message
                </button>
            </div>
            
            <div class="messages-container">
                <div class="messages-sidebar">
                    <div class="message-filters">
                        <button class="filter-btn active">All Messages</button>
                        <button class="filter-btn">Unread (2)</button>
                        <button class="filter-btn">From Attorney</button>
                        <button class="filter-btn">Sent</button>
                    </div>
                </div>
                
                <div class="messages-content">
                    <div class="messages-list">
                        ${this.data.recentMessages.map(message => `
                            <div class="message-card ${message.unread ? 'unread' : ''}">
                                <div class="message-header">
                                    <div class="message-sender">
                                        <div class="sender-avatar">
                                            <i class="fas fa-user"></i>
                                        </div>
                                        <div class="sender-info">
                                            <h5>${message.from}</h5>
                                            <span class="message-date">${message.date}</span>
                                        </div>
                                    </div>
                                    ${message.unread ? '<div class="unread-indicator"></div>' : ''}
                                </div>
                                <div class="message-content">
                                    <h4>${message.subject}</h4>
                                    <p>${message.preview}</p>
                                </div>
                                <div class="message-actions">
                                    <button class="btn btn--outline btn--sm">Reply</button>
                                    <button class="btn btn--outline btn--sm">Forward</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Load Payments Section
    loadPaymentsSection(section) {
        section.innerHTML = `
            <div class="section-header">
                <div>
                    <h2>Payments & Invoices</h2>
                    <p>View and manage your legal service payments</p>
                </div>
                <button class="btn btn--primary">
                    <i class="fas fa-credit-card"></i>
                    Make Payment
                </button>
            </div>
            
            <div class="payment-summary">
                <div class="summary-card outstanding">
                    <div class="summary-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="summary-content">
                        <h3>Outstanding Balance</h3>
                        <div class="amount">$800.00</div>
                        <p>Due: August 1, 2025</p>
                    </div>
                </div>
                
                <div class="summary-card paid">
                    <div class="summary-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="summary-content">
                        <h3>Total Paid</h3>
                        <div class="amount">$3,700.00</div>
                        <p>Last payment: July 15, 2025</p>
                    </div>
                </div>
            </div>
            
            <div class="payments-list">
                <h3>Payment History</h3>
                <div class="payments-table">
                    ${this.data.paymentHistory.map(payment => `
                        <div class="payment-row">
                            <div class="payment-invoice">
                                <h4>${payment.invoice}</h4>
                                <p>${payment.description}</p>
                            </div>
                            <div class="payment-details">
                                <span class="payment-amount">${payment.amount}</span>
                                <span class="payment-date">${payment.date}</span>
                                <span class="status status--${payment.status === 'Paid' ? 'success' : 'warning'}">${payment.status}</span>
                            </div>
                            <div class="payment-actions">
                                <button class="btn btn--outline btn--sm">Download PDF</button>
                                ${payment.status === 'Pending' ? '<button class="btn btn--primary btn--sm">Pay Now</button>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Load Calendar Section
    loadCalendarSection(section) {
        section.innerHTML = `
            <div class="section-header">
                <div>
                    <h2>Calendar & Appointments</h2>
                    <p>Schedule and track important dates</p>
                </div>
                <button class="btn btn--primary">
                    <i class="fas fa-plus"></i>
                    Schedule Appointment
                </button>
            </div>
            
            <div class="calendar-container">
                <div class="calendar-header">
                    <div class="calendar-nav">
                        <button class="btn btn--outline">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h3>July 2025</h3>
                        <button class="btn btn--outline">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    <div class="calendar-view-toggle">
                        <button class="view-btn active">Month</button>
                        <button class="view-btn">Week</button>
                        <button class="view-btn">Day</button>
                    </div>
                </div>
                
                <div class="calendar-grid">
                    ${this.generateCalendarGrid()}
                </div>
                
                <div class="upcoming-appointments">
                    <h4>Upcoming Appointments</h4>
                    <div class="appointment-list">
                        <div class="appointment-item">
                            <div class="appointment-time">
                                <span class="time">2:00 PM</span>
                                <span class="date">Jul 30</span>
                            </div>
                            <div class="appointment-details">
                                <h5>Property Closing</h5>
                                <p>123 Main Street - Final signing</p>
                                <span class="appointment-location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Law Office Conference Room
                                </span>
                            </div>
                        </div>
                        
                        <div class="appointment-item">
                            <div class="appointment-time">
                                <span class="time">10:00 AM</span>
                                <span class="date">Aug 2</span>
                            </div>
                            <div class="appointment-details">
                                <h5>Document Review Meeting</h5>
                                <p>Commercial lease agreement review</p>
                                <span class="appointment-location">
                                    <i class="fas fa-video"></i>
                                    Video Conference
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tasks-section">
                    <h4>Upcoming Tasks</h4>
                    <div class="task-list">
                        ${this.data.upcomingTasks.map(task => `
                            <div class="task-item priority-${task.priority.toLowerCase()}">
                                <div class="task-checkbox">
                                    <input type="checkbox" id="task${task.id}" ${task.completed ? 'checked' : ''}>
                                </div>
                                <div class="task-content">
                                    <h5>${task.task}</h5>
                                    <span class="task-deadline">Due: ${task.deadline}</span>
                                </div>
                                <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Load Profile Section
    loadProfileSection(section) {
        section.innerHTML = `
            <div class="section-header">
                <div>
                    <h2>Client Profile</h2>
                    <p>Manage your personal information and preferences</p>
                </div>
                <button class="btn btn--primary">
                    <i class="fas fa-edit"></i>
                    Edit Profile
                </button>
            </div>
            
            <div class="profile-container">
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <img src="${this.data.user.avatar}" alt="${this.data.user.name}">
                        </div>
                        <div class="profile-info">
                            <h3>${this.data.user.name}</h3>
                            <p>${this.data.user.role}</p>
                            <span class="member-since">Member since ${this.data.user.memberSince}</span>
                        </div>
                    </div>
                    
                    <div class="profile-details">
                        <div class="detail-section">
                            <h4>Contact Information</h4>
                            <div class="detail-row">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${this.data.user.email}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Phone:</span>
                                <span class="detail-value">(555) 123-4567</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Address:</span>
                                <span class="detail-value">123 Main Street<br>Denver, CO 80202</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Account Settings</h4>
                            <div class="detail-row">
                                <span class="detail-label">Notifications:</span>
                                <span class="detail-value">Email & SMS</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Two-Factor Auth:</span>
                                <span class="detail-value status--success">Enabled</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Last Login:</span>
                                <span class="detail-value">July 27, 2025 at 9:30 AM</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-briefcase"></i>
                        </div>
                        <div class="stat-content">
                            <h4>Active Cases</h4>
                            <div class="stat-value">3</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="stat-content">
                            <h4>Documents</h4>
                            <div class="stat-value">24</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="stat-content">
                            <h4>Total Paid</h4>
                            <div class="stat-value">$3,700</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Load Settings Section
    loadSettingsSection(section) {
        section.innerHTML = `
            <div class="section-header">
                <div>
                    <h2>Settings</h2>
                    <p>Customize your portal experience and preferences</p>
                </div>
            </div>
            
            <div class="settings-container">
                <div class="settings-section">
                    <h3>Notification Preferences</h3>
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Email Notifications</h4>
                            <p>Receive updates about your cases via email</p>
                        </div>
                        <label class="toggle">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>SMS Notifications</h4>
                            <p>Receive urgent updates via text message</p>
                        </div>
                        <label class="toggle">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Desktop Notifications</h4>
                            <p>Show browser notifications for new messages</p>
                        </div>
                        <label class="toggle">
                            <input type="checkbox">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>Security Settings</h3>
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Two-Factor Authentication</h4>
                            <p>Add an extra layer of security to your account</p>
                        </div>
                        <button class="btn btn--primary btn--sm">Configure</button>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Change Password</h4>
                            <p>Update your account password</p>
                        </div>
                        <button class="btn btn--outline btn--sm">Change</button>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Login History</h4>
                            <p>View recent login activity</p>
                        </div>
                        <button class="btn btn--outline btn--sm">View History</button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>Data & Privacy</h3>
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Download My Data</h4>
                            <p>Export all your portal data</p>
                        </div>
                        <button class="btn btn--outline btn--sm">Download</button>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Data Retention</h4>
                            <p>Control how long your data is stored</p>
                        </div>
                        <select class="form-control" style="width: auto;">
                            <option>7 years (Legal requirement)</option>
                            <option>10 years</option>
                            <option>Indefinitely</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate calendar grid
    generateCalendarGrid() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let html = '<div class="calendar-days">';
        
        days.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        
        for (let i = 1; i <= 31; i++) {
            const isToday = i === 27; // Current date
            const hasEvent = [30].includes(i); // Days with events
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
                    <span class="day-number">${i}</span>
                    ${hasEvent ? '<div class="event-dot"></div>' : ''}
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    // Helper function to get status class
    getStatusClass(status) {
        const statusMap = {
            'In Progress': 'success',
            'Under Review': 'warning', 
            'Closing Scheduled': 'info',
            'Signed': 'success',
            'Pending Review': 'warning',
            'Received': 'info',
            'Paid': 'success',
            'Pending': 'warning'
        };
        return statusMap[status] || 'info';
    }

    // Update dashboard with real-time data
    updateDashboard() {
        // This would typically fetch fresh data from the server
        console.log('Dashboard updated with latest data');
    }

    // Mobile menu functionality
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }
    }

    // Modal functionality - Fixed to properly display modal
    openTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.remove('hidden');
            // Focus on first input for accessibility
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // Handle task submission
    handleTaskSubmission(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;
        
        if (!title || !dueDate || !priority) {
            this.showToast('error', 'Validation Error', 'Please fill in all required fields.');
            return;
        }
        
        // Add task to data
        const newTask = {
            id: this.data.upcomingTasks.length + 1,
            task: title,
            deadline: dueDate,
            priority: priority.charAt(0).toUpperCase() + priority.slice(1),
            completed: false
        };
        
        this.data.upcomingTasks.unshift(newTask);
        
        this.closeAllModals();
        this.showToast('success', 'Task Created', 'Your new task has been added successfully.');
        
        // Reset form
        document.getElementById('taskForm').reset();
        
        // Refresh the current section if it's calendar (where tasks are shown)
        if (this.currentSection === 'calendar') {
            this.loadSectionContent('calendar');
        }
    }

    // Handle task toggle
    handleTaskToggle(checkbox) {
        const taskId = parseInt(checkbox.id.replace('task', ''));
        const isCompleted = checkbox.checked;
        
        // Update task status in data
        const task = this.data.upcomingTasks.find(t => t.id === taskId);
        if (task) {
            task.completed = isCompleted;
        }
        
        this.showToast('info', 'Task Updated', `Task has been marked as ${isCompleted ? 'completed' : 'incomplete'}.`);
    }

    // Show notifications
    showNotifications() {
        this.showToast('info', 'Notifications', 'You have 2 new notifications: Document ready for review, Payment reminder.');
    }

    // Handle logout
    handleLogout() {
        this.showToast('info', 'Logged Out', 'You have been successfully logged out.');
        // In a real app, this would redirect to login page
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
        
        // Alt + number shortcuts for navigation
        if (e.altKey && e.key >= '1' && e.key <= '8') {
            e.preventDefault();
            const sections = ['dashboard', 'cases', 'documents', 'messages', 'payments', 'calendar', 'profile', 'settings'];
            const index = parseInt(e.key) - 1;
            if (sections[index]) {
                this.navigateToSection(sections[index]);
            }
        }
    }

    // Show toast notifications
    showToast(type, title, message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        container.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }

    // Generate implementation guide
    generateImplementationGuide() {
        const guide = {
            title: "Law Offices of Pritpal Singh - Client Portal Implementation Guide",
            overview: "This comprehensive guide provides step-by-step instructions for implementing a fully functional client portal with backend integrations.",
            sections: [
                {
                    title: "1. Technology Stack Setup",
                    steps: [
                        "Frontend: HTML5, CSS3, JavaScript (ES6+), responsive design framework",
                        "Backend: Node.js with Express.js or Python Django/Flask",
                        "Database: PostgreSQL or MongoDB for client data storage",
                        "Authentication: JWT tokens with OAuth2 integration",
                        "File Storage: AWS S3 or Google Cloud Storage for documents",
                        "Payment Processing: Stripe or LawPay integration",
                        "Email Service: SendGrid or AWS SES for notifications"
                    ]
                },
                {
                    title: "2. Database Schema Design",
                    steps: [
                        "Users table: id, name, email, password_hash, role, created_at, updated_at",
                        "Cases table: id, user_id, title, type, status, progress, attorney_id, created_at",
                        "Documents table: id, case_id, name, file_url, type, status, upload_date",
                        "Messages table: id, sender_id, recipient_id, subject, content, read_status, timestamp",
                        "Payments table: id, user_id, amount, status, invoice_number, due_date, paid_date",
                        "Tasks table: id, user_id, case_id, title, description, priority, due_date, completed",
                        "Appointments table: id, user_id, attorney_id, title, date_time, location, type"
                    ]
                },
                {
                    title: "3. Backend API Endpoints",
                    steps: [
                        "Authentication: POST /api/auth/login, POST /api/auth/logout, POST /api/auth/refresh",
                        "Users: GET /api/users/profile, PUT /api/users/profile, POST /api/users/change-password",
                        "Cases: GET /api/cases, GET /api/cases/:id, POST /api/cases, PUT /api/cases/:id",
                        "Documents: GET /api/documents, POST /api/documents/upload, GET /api/documents/:id/download",
                        "Messages: GET /api/messages, POST /api/messages, PUT /api/messages/:id/read",
                        "Payments: GET /api/payments, POST /api/payments/process, GET /api/invoices",
                        "Tasks: GET /api/tasks, POST /api/tasks, PUT /api/tasks/:id, DELETE /api/tasks/:id",
                        "Calendar: GET /api/appointments, POST /api/appointments, PUT /api/appointments/:id"
                    ]
                },
                {
                    title: "4. Security Implementation",
                    steps: [
                        "SSL/TLS encryption for all communications",
                        "JWT token-based authentication with refresh tokens",
                        "Role-based access control (RBAC) for different user types",
                        "Input validation and sanitization on all endpoints",
                        "Rate limiting to prevent abuse",
                        "CORS configuration for secure cross-origin requests",
                        "File upload validation and virus scanning",
                        "Audit logging for all user actions",
                        "Two-factor authentication (2FA) implementation",
                        "Password hashing with bcrypt or Argon2"
                    ]
                },
                {
                    title: "5. Payment Integration",
                    steps: [
                        "Integrate LawPay API for legal-compliant payment processing",
                        "Implement Stripe as backup payment processor",
                        "Create secure payment forms with PCI compliance",
                        "Generate and email invoices automatically",
                        "Track payment status and send reminders",
                        "Implement refund and chargeback handling",
                        "Generate payment reports for accounting",
                        "Set up webhook endpoints for payment status updates"
                    ]
                },
                {
                    title: "6. Document Management System",
                    steps: [
                        "Implement secure file upload with virus scanning",
                        "Create document versioning system",
                        "Generate preview thumbnails for common file types",
                        "Implement document sharing with expiring links",
                        "Add digital signature capabilities",
                        "Create document templates for common legal forms",
                        "Implement OCR for searchable document content",
                        "Set up automated backup and retention policies"
                    ]
                },
                {
                    title: "7. Communication Features",
                    steps: [
                        "Build secure messaging system with encryption",
                        "Implement real-time notifications with WebSockets",
                        "Create email notification system for important updates",
                        "Add SMS notifications for urgent matters",
                        "Implement video conferencing integration (Zoom/Teams)",
                        "Create message threading and organization",
                        "Add file attachment capabilities to messages",
                        "Implement message read receipts and status tracking"
                    ]
                },
                {
                    title: "8. Calendar and Scheduling",
                    steps: [
                        "Integrate with Google Calendar or Outlook",
                        "Create appointment booking system with availability",
                        "Send automated appointment reminders",
                        "Implement calendar sharing between clients and attorneys",
                        "Add recurring appointment support",
                        "Create deadline tracking and alerts",
                        "Implement timezone handling for multi-location clients",
                        "Generate calendar reports and analytics"
                    ]
                },
                {
                    title: "9. Reporting and Analytics",
                    steps: [
                        "Create client dashboard with key metrics",
                        "Implement case progress tracking and reporting",
                        "Generate financial reports and payment summaries",
                        "Create document usage and access analytics",
                        "Build communication activity reports",
                        "Implement time tracking for billable hours",
                        "Create custom report builder for attorneys",
                        "Add data export capabilities (PDF, Excel, CSV)"
                    ]
                },
                {
                    title: "10. Mobile Responsiveness",
                    steps: [
                        "Implement responsive design for all screen sizes",
                        "Create progressive web app (PWA) capabilities",
                        "Optimize touch interactions for mobile devices",
                        "Implement offline functionality for key features",
                        "Add push notifications for mobile devices",
                        "Optimize file upload for mobile connections",
                        "Create mobile-specific navigation patterns",
                        "Test across multiple devices and browsers"
                    ]
                },
                {
                    title: "11. Third-Party Integrations",
                    steps: [
                        "CRM Integration: Salesforce or HubSpot for client management",
                        "Accounting Software: QuickBooks or Xero integration",
                        "E-signature: DocuSign or Adobe Sign integration",
                        "Time Tracking: Integration with legal time tracking software",
                        "Cloud Storage: Dropbox or Box integration for document sync",
                        "Email Marketing: Mailchimp integration for client communications",
                        "Analytics: Google Analytics for usage tracking",
                        "Backup Services: Automated cloud backup integration"
                    ]
                },
                {
                    title: "12. Compliance and Legal Requirements",
                    steps: [
                        "Implement GDPR compliance for data protection",
                        "Ensure HIPAA compliance if handling sensitive information",
                        "Create comprehensive privacy policy and terms of service",
                        "Implement data retention and deletion policies",
                        "Set up audit trails for regulatory compliance",
                        "Create client consent management system",
                        "Implement data encryption at rest and in transit",
                        "Regular security audits and penetration testing"
                    ]
                },
                {
                    title: "13. Testing and Quality Assurance",
                    steps: [
                        "Unit testing for all backend API endpoints",
                        "Integration testing for third-party services",
                        "Frontend testing with tools like Jest or Cypress",
                        "Security testing and vulnerability scanning",
                        "Performance testing and load testing",
                        "Cross-browser compatibility testing",
                        "Mobile device testing on various platforms",
                        "User acceptance testing with real clients"
                    ]
                },
                {
                    title: "14. Deployment and DevOps",
                    steps: [
                        "Set up CI/CD pipeline with automated testing",
                        "Configure production environment on AWS/Azure/GCP",
                        "Implement container deployment with Docker",
                        "Set up monitoring and logging with tools like ELK stack",
                        "Configure automated backups and disaster recovery",
                        "Implement blue-green deployment for zero downtime",
                        "Set up SSL certificates and domain configuration",
                        "Create deployment rollback procedures"
                    ]
                },
                {
                    title: "15. Maintenance and Support",
                    steps: [
                        "Create user documentation and help system",
                        "Set up helpdesk system for client support",
                        "Implement system monitoring and alerts",
                        "Create regular maintenance schedules",
                        "Plan for software updates and security patches",
                        "Set up performance monitoring and optimization",
                        "Create backup and recovery procedures",
                        "Plan for scaling and capacity management"
                    ]
                }
            ],
            footer: "This implementation guide provides a comprehensive roadmap for building a professional-grade client portal. Each section should be implemented with careful attention to security, user experience, and legal compliance requirements."
        };

        console.log("📋 Implementation Guide Generated:");
        console.log("=".repeat(60));
        console.log(guide.title);
        console.log("=".repeat(60));
        console.log(guide.overview);
        console.log("");
        
        guide.sections.forEach(section => {
            console.log(`${section.title}`);
            console.log("-".repeat(section.title.length));
            section.steps.forEach((step, index) => {
                console.log(`${index + 1}. ${step}`);
            });
            console.log("");
        });
        
        console.log(guide.footer);
        console.log("=".repeat(60));

        return guide;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lawPortal = new LawPortalApp();
});

// Additional CSS for dynamic content
const additionalCSS = `
    .cases-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 1.5rem;
    }

    .case-card {
        background: white;
        border-radius: 12px;
        border: 1px solid var(--border-color);
        overflow: hidden;
        transition: var(--transition);
    }

    .case-card:hover {
        box-shadow: var(--shadow-medium);
        transform: translateY(-2px);
    }

    .case-card-header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--light-gray);
    }

    .case-badge {
        background: var(--navy-blue);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .case-card-body {
        padding: 1.5rem;
    }

    .case-card-body h3 {
        margin-bottom: 0.5rem;
        color: var(--dark-gray);
    }

    .case-type {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 1rem;
    }

    .case-details {
        margin-bottom: 1.5rem;
    }

    .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .detail-label {
        color: #6b7280;
        font-size: 0.875rem;
    }

    .detail-value {
        font-weight: 500;
        color: var(--dark-gray);
        font-size: 0.875rem;
    }

    .case-progress {
        margin-bottom: 1rem;
    }

    .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: var(--dark-gray);
    }

    .case-card-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--border-color);
        display: flex;
        gap: 0.75rem;
        background: var(--light-gray);
    }

    .documents-filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        align-items: center;
    }

    .search-bar {
        position: relative;
        flex: 1;
    }

    .search-bar i {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
    }

    .documents-grid {
        display: grid;
        gap: 1rem;
    }

    .document-card {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: var(--transition);
    }

    .document-card:hover {
        box-shadow: var(--shadow-light);
    }

    .document-icon {
        width: 48px;
        height: 48px;
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-red);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }

    .document-info {
        flex: 1;
    }

    .document-info h4 {
        margin-bottom: 0.25rem;
        color: var(--dark-gray);
    }

    .document-meta {
        color: #6b7280;
        font-size: 0.75rem;
        margin-bottom: 0.5rem;
    }

    .document-actions {
        display: flex;
        gap: 0.5rem;
    }

    .messages-container {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 2rem;
        background: white;
        border-radius: 12px;
        border: 1px solid var(--border-color);
        overflow: hidden;
    }

    .messages-sidebar {
        background: var(--light-gray);
        padding: 1.5rem;
    }

    .message-filters {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .filter-btn {
        background: none;
        border: none;
        padding: 0.75rem;
        text-align: left;
        border-radius: 6px;
        cursor: pointer;
        transition: var(--transition);
        font-size: 0.875rem;
    }

    .filter-btn.active,
    .filter-btn:hover {
        background: white;
        color: var(--navy-blue);
    }

    .messages-content {
        padding: 1.5rem;
    }

    .message-card {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        transition: var(--transition);
    }

    .message-card.unread {
        background: rgba(255, 73, 0, 0.05);
        border-left: 3px solid var(--orange);
    }

    .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }

    .unread-indicator {
        width: 8px;
        height: 8px;
        background: var(--orange);
        border-radius: 50%;
    }

    .message-content h4 {
        color: var(--dark-gray);
        margin-bottom: 0.5rem;
    }

    .message-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.75rem;
    }

    .payment-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .summary-card {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .summary-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        color: white;
    }

    .summary-card.outstanding .summary-icon {
        background: var(--error-red);
    }

    .summary-card.paid .summary-icon {
        background: var(--success-green);
    }

    .summary-content h3 {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }

    .summary-content .amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--dark-gray);
        margin-bottom: 0.25rem;
    }

    .payments-table {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
    }

    .payment-row {
        display: flex;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .payment-row:last-child {
        border-bottom: none;
    }

    .payment-invoice {
        flex: 1;
    }

    .payment-invoice h4 {
        color: var(--dark-gray);
        margin-bottom: 0.25rem;
    }

    .payment-invoice p {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
    }

    .payment-details {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.25rem;
        margin-right: 1rem;
    }

    .payment-actions {
        display: flex;
        gap: 0.5rem;
    }

    .calendar-container {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .calendar-nav {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .calendar-view-toggle {
        display: flex;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        overflow: hidden;
    }

    .view-btn {
        background: none;
        border: none;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 0.875rem;
        transition: var(--transition);
    }

    .view-btn.active {
        background: var(--navy-blue);
        color: white;
    }

    .calendar-grid .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1px;
        background: var(--border-color);
        border: 1px solid var(--border-color);
        margin-bottom: 2rem;
    }

    .calendar-day-header {
        background: var(--light-gray);
        padding: 0.75rem;
        text-align: center;
        font-weight: 600;
        font-size: 0.875rem;
    }

    .calendar-day {
        background: white;
        padding: 0.75rem;
        min-height: 60px;
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: flex-start;
    }

    .calendar-day:hover {
        background: var(--light-gray);
    }

    .calendar-day.today {
        background: rgba(30, 58, 138, 0.1);
        color: var(--navy-blue);
        font-weight: 600;
    }

    .calendar-day.has-event::after {
        content: '';
        position: absolute;
        bottom: 4px;
        right: 4px;
        width: 6px;
        height: 6px;
        background: var(--orange);
        border-radius: 50%;
    }

    .appointment-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .appointment-item {
        background: var(--light-gray);
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        gap: 1rem;
    }

    .appointment-time {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 60px;
        background: var(--orange);
        color: white;
        border-radius: 6px;
        padding: 0.5rem;
    }

    .appointment-time .time {
        font-weight: 600;
        font-size: 0.875rem;
    }

    .appointment-time .date {
        font-size: 0.75rem;
    }

    .appointment-details h5 {
        color: var(--dark-gray);
        margin-bottom: 0.25rem;
    }

    .appointment-details p {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }

    .appointment-location {
        color: #6b7280;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .tasks-section {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    .tasks-section h4 {
        margin-bottom: 1rem;
        color: var(--dark-gray);
    }

    .profile-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
    }

    .profile-card {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        overflow: hidden;
    }

    .profile-header {
        background: var(--light-gray);
        padding: 2rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .profile-avatar img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }

    .profile-info h3 {
        color: var(--dark-gray);
        margin-bottom: 0.25rem;
    }

    .profile-info p {
        color: #6b7280;
        margin-bottom: 0.5rem;
    }

    .member-since {
        color: #6b7280;
        font-size: 0.875rem;
    }

    .profile-details {
        padding: 2rem;
    }

    .detail-section {
        margin-bottom: 2rem;
    }

    .detail-section h4 {
        color: var(--dark-gray);
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-color);
    }

    .profile-stats {
        display: grid;
        gap: 1rem;
    }

    .stat-card {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        background: var(--navy-blue);
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }

    .stat-content h4 {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--dark-gray);
    }

    .settings-container {
        display: grid;
        gap: 2rem;
    }

    .settings-section {
        background: white;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
    }

    .settings-section h3 {
        color: var(--dark-gray);
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--border-color);
    }

    .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
        border-bottom: 1px solid var(--border-color);
    }

    .setting-item:last-child {
        border-bottom: none;
    }

    .setting-info h4 {
        color: var(--dark-gray);
        margin-bottom: 0.25rem;
    }

    .setting-info p {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
    }

    .toggle {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
    }

    .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 24px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: var(--navy-blue);
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }

    @media (max-width: 768px) {
        .messages-container {
            grid-template-columns: 1fr;
        }
        
        .messages-sidebar {
            order: 2;
        }
        
        .payment-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .payment-details {
            align-items: flex-start;
            margin-right: 0;
        }

        .profile-container {
            grid-template-columns: 1fr;
        }

        .profile-header {
            flex-direction: column;
            text-align: center;
        }
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);