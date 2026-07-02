document.addEventListener('DOMContentLoaded', function() {
    // Make all links open in a new tab
    makeAllLinksOpenInNewTab();

    // Set up MutationObserver to watch for dynamically added links
    setupLinkObserver();

    initHomeTabs();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // Load publications data from JSON file
    loadPublications();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply smooth scrolling to hash links (internal page links)
            if (!document.body.classList.contains('tabbed-homepage') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Account for the sticky nav
                    const navHeight = document.querySelector('.top-nav').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active class
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Update active nav link on scroll
    if (!document.body.classList.contains('tabbed-homepage')) {
        window.addEventListener('scroll', function() {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            const navHeight = document.querySelector('.top-nav').offsetHeight;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                
                if (pageYOffset >= sectionTop - navHeight - 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkTarget = link.getAttribute('href').substring(1);
                // Handle both homepage and about pointing to the same section
                if (linkTarget === current || 
                    (current === 'homepage' && linkTarget === 'about') ||
                    (current === 'about' && linkTarget === 'homepage')) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Load news data
    let newsJsonPath = 'data/news.json';
    if (window.location.pathname.includes('/pages/')) {
        newsJsonPath = '../data/news.json';
    }
    
    fetch(newsJsonPath)
        .then(response => response.json())
        .then(data => {
            // Check if we're on the homepage
            const latestNewsSection = document.getElementById('latest-news');
            if (latestNewsSection) {
                // On homepage - show limited news (first 8 items)
                renderNewsItems(data.slice(0, 8), 'news-container');
            }
            
            // Check if we're on the all-news page
            const allNewsSection = document.getElementById('all-news');
            if (allNewsSection) {
                // On all-news page - show all news items
                renderNewsItems(data, 'all-news-container');
            }
        })
        .catch(error => {
            console.error('Error loading news data:', error);
        });
    
    // Load honors data
    let honorsJsonPath = 'data/honors.json';
    if (window.location.pathname.includes('/pages/')) {
        honorsJsonPath = '../data/honors.json';
    }
    
    fetch(honorsJsonPath)
        .then(response => response.json())
        .then(data => {
            // Check if we're on the homepage
            const honorsSection = document.getElementById('honors');
            if (honorsSection) {
                // On homepage - show limited honors (first 8 items)
                renderHonorsItems(data.slice(0, 8), 'honors-container');
            }
            
            // Check if we're on the all-honors page
            const allHonorsSection = document.getElementById('all-honors');
            if (allHonorsSection) {
                // On all-honors page - show all honors items
                renderHonorsItems(data, 'all-honors-container');
            }
        })
        .catch(error => {
            console.error('Error loading honors data:', error);
        });
});

const PUBLICATION_TOPIC_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'art', label: 'ART' },
    { id: 'tcp', label: 'TCP' },
    { id: 'llm', label: 'LLM-assisted Testing' },
    { id: 'gui', label: 'GUI' },
    { id: 'android', label: 'Android' },
    { id: 'web', label: 'Web/API' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'spl', label: 'SPL' },
    { id: 'dl-testing', label: 'DL Testing' },
    { id: 'survey', label: 'Survey' },
    { id: 'other', label: 'Other' }
];

const PUBLICATION_LEVEL_FILTERS = [
    { id: 'all', label: 'All Levels' },
    { id: 'ccf-a', label: 'CCF-A' },
    { id: 'ccf-b', label: 'CCF-B' },
    { id: 'ccf-c', label: 'CCF-C' },
    { id: 'trans', label: 'Transactions' },
    { id: 'other', label: 'Other' }
];

const CORE_GROUPS = [
    { id: 'ccf-a', label: 'CCF-A Publications' },
    { id: 'ccf-b', label: 'CCF-B Publications' },
    { id: 'trans', label: 'Transactions Papers' }
];

function initHomeTabs() {
    if (!document.body.classList.contains('tabbed-homepage')) return;

    const panels = Array.from(document.querySelectorAll('.content-panel'));
    const tabLinks = Array.from(document.querySelectorAll('.site-tab-link'));
    if (!panels.length || !tabLinks.length) return;

    const panelIds = new Set(panels.map(panel => panel.id));

    function activatePanel(panelId, shouldUpdateHash = true) {
        const targetId = panelIds.has(panelId) ? panelId : 'homepage';

        panels.forEach(panel => {
            panel.classList.toggle('active-panel', panel.id === targetId);
        });

        tabLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            link.classList.toggle('active', href === `#${targetId}`);
        });

        if (shouldUpdateHash) {
            history.replaceState(null, '', `#${targetId}`);
        }

        const nav = document.querySelector('.top-nav');
        const navHeight = nav ? nav.offsetHeight : 0;
        const main = document.querySelector('main');
        const top = main ? main.offsetTop - navHeight : 0;
        window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;

            event.preventDefault();
            activatePanel(href.substring(1));

            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.add('hidden');
        });
    });

    const initialId = window.location.hash ? window.location.hash.substring(1) : 'homepage';
    activatePanel(initialId, false);
}

// Function to load publications from JSON
function loadPublications() {
    let publicationsJsonPath = 'data/publications.json';
    if (window.location.pathname.includes('/pages/')) {
        publicationsJsonPath = '../data/publications.json';
    }

    const publicationsList = document.querySelector('.publications-list');
    if (!publicationsList) {
        return;
    }
    
    // Clear existing publications
    publicationsList.innerHTML = '';
    
    fetch(`${publicationsJsonPath}?v=20260701c`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(publications => {
            console.log('Loaded publications:', publications.length);

            if (document.body.classList.contains('publication-page')) {
                renderPublicationPage(publicationsList, publications);
                return;
            }
            
            // Filter publications to show on homepage based on showOnHomepage flag
            let pubsToShow = publications;
            
            // Sort by year descending (Preprints/Missing year at top)
            pubsToShow.sort((a, b) => {
                const yearA = a.year ? parseInt(a.year) : 9999;
                const yearB = b.year ? parseInt(b.year) : 9999;
                return yearB - yearA;
            });

            // Group by year
            const pubsByYear = {};
            pubsToShow.forEach(pub => {
                const year = pub.year || 'Preprint';
                if (!pubsByYear[year]) {
                    pubsByYear[year] = [];
                }
                pubsByYear[year].push(pub);
            });

            // Get sorted years
            const sortedYears = Object.keys(pubsByYear).sort((a, b) => {
                if (a === 'Preprint') return -1;
                if (b === 'Preprint') return 1;
                return b - a;
            });

            // Render groups
            sortedYears.forEach(year => {
                const yearGroup = document.createElement('div');
                yearGroup.className = 'pub-year-group';

                // Year Header
                const yearHeader = document.createElement('h3');
                yearHeader.className = 'pub-year-header';
                yearHeader.textContent = `-${year}-`;
                yearGroup.appendChild(yearHeader);

                // List
                const ul = document.createElement('ul');
                ul.className = 'pub-list-ul';

                pubsByYear[year].forEach(pub => {
                    const li = document.createElement('li');
                    li.className = 'pub-list-item';

                    // Wrapper for text content to allow side-by-side layout with thumbnail
                    const contentWrapper = document.createElement('div');
                    contentWrapper.className = 'pub-content-wrapper';

                    // --- Line 1: [Venue] Title ---
                    const line1 = document.createElement('div');
                    line1.className = 'pub-line-1';

                    // Venue Tag
                    const venueTagSpan = document.createElement('span');
                    const venueShort = getVenueShortName(pub.venue, pub.year);
                    venueTagSpan.textContent = `[${venueShort}]`;
                    venueTagSpan.className = 'pub-venue-tag';
                    if (venueShort.toLowerCase().includes('arxiv') || venueShort.toLowerCase().includes('preprint')) {
                        venueTagSpan.classList.add('tag-arxiv');
                    } else {
                        venueTagSpan.classList.add('tag-conference');
                    }
                    line1.appendChild(venueTagSpan);

                    // Title (Text only, no link on title itself)
                    const titleSpan = document.createElement('span');
                    titleSpan.className = 'pub-title-text';
                    titleSpan.textContent = pub.title;
                    line1.appendChild(titleSpan);
                    
                    // Paper/Code Buttons
                    getPublicationLinks(pub).forEach(linkData => {
                        if (!linkData.url || linkData.url === '#') return;

                        const btn = document.createElement('a');
                        btn.className = 'pub-link-btn';
                        btn.href = linkData.url;
                        btn.target = '_blank';
                        btn.rel = 'noopener';
                        btn.textContent = linkData.label || 'Link';
                        line1.appendChild(btn);
                    });

                    // Thumbnail Preview Button (if thumbnail exists)
                    let thumbBox = null;
                    if (pub.thumbnail) {
                        const btnPreview = document.createElement('button');
                        btnPreview.className = 'pub-link-btn pub-btn-preview';
                        btnPreview.textContent = 'Image';
                        btnPreview.onclick = function() {
                            if (li.classList.contains('with-thumbnail-expanded')) {
                                li.classList.remove('with-thumbnail-expanded');
                                thumbBox.style.display = 'none';
                                btnPreview.classList.remove('active');
                            } else {
                                li.classList.add('with-thumbnail-expanded');
                                thumbBox.style.display = 'block';
                                btnPreview.classList.add('active');
                            }
                        };
                        line1.appendChild(btnPreview);

                        // Create thumbnail container
                        thumbBox = document.createElement('div');
                        thumbBox.className = 'pub-thumbnail-box';
                        thumbBox.style.display = 'none';
                        const thumbImg = document.createElement('img');
                        thumbImg.src = pub.thumbnail;
                        thumbImg.alt = 'Publication Thumbnail';
                        thumbBox.appendChild(thumbImg);
                    }
                    
                    contentWrapper.appendChild(line1);

                    // --- Line 2: Authors ---
                    const line2 = document.createElement('div');
                    line2.className = 'pub-line-2';
                    line2.innerHTML = pub.authors; // keep innerHTML for <strong>/<u>
                    contentWrapper.appendChild(line2);

                    // --- Line 3: Venue Details ---
                    const line3 = document.createElement('div');
                    line3.className = 'pub-line-3';
                    
                    // 1. Badge (Oral/Spotlight) - Red Box at start
                    let badgeText = pub.highlight || '';
                    // if (highlightText.toLowerCase().includes('oral')) badgeText = 'Oral';
                    // else if (highlightText.toLowerCase().includes('spotlight')) badgeText = 'Spotlight';
                    
                    if (badgeText) {
                        const badge = document.createElement('span');
                        badge.className = 'pub-badge-highlight';
                        badge.textContent = badgeText;
                        line3.appendChild(badge);
                    }

                    // 2. Full Venue Name (No Year for Journals)
                    const fullVenueName = getVenueFullName(pub.venue, pub.year);
                    const venueNameSpan = document.createElement('span');
                    venueNameSpan.textContent = fullVenueName;
                    line3.appendChild(venueNameSpan);

                    // 3. CCF Rank
                    const ccfRank = getCCFRank(fullVenueName);
                    if (ccfRank) {
                        const rankSpan = document.createElement('span');
                        rankSpan.className = `ccf-rank ccf-${ccfRank.toLowerCase()}`;
                        rankSpan.textContent = `(CCF-${ccfRank})`;
                        line3.appendChild(rankSpan);
                    }

                    contentWrapper.appendChild(line3);
                    
                    // Append wrapper and thumbnail box to LI
                    li.appendChild(contentWrapper);
                    if (thumbBox) {
                        li.appendChild(thumbBox);
                    }

                    ul.appendChild(li);
                });

                yearGroup.appendChild(ul);
                publicationsList.appendChild(yearGroup);
            });
        })
        .catch(error => {
            console.error('Error loading publications data:', error);
            publicationsList.innerHTML = '<p>Failed to load publications. Please check the console for details.</p>';
        });
}

function renderPublicationPage(container, publications) {
    const indexedPublications = publications.map((pub, index) => ({ ...pub, originalIndex: index }));
    const sortedPublications = sortPublications(indexedPublications);
    const tabs = document.querySelectorAll('[data-publication-view]');
    const note = document.querySelector('.publication-note');
    const filters = initPublicationFilters(sortedPublications, () => render('full'));

    function render(view) {
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-publication-view') === view);
        });

        container.innerHTML = '';

        if (note) {
            note.classList.toggle('hidden', view !== 'core');
        }

        if (filters.panel) {
            filters.panel.classList.toggle('hidden', view !== 'full');
        }

        if (view === 'full') {
            const filtered = sortedPublications.filter(pub => matchesPublicationFilters(pub, filters.state));
            renderFullPublicationList(container, filtered);
            updatePublicationFilterSummary(filtered.length, sortedPublications.length);
            return;
        }

        renderCorePublicationCards(container, sortedPublications);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            render(tab.getAttribute('data-publication-view'));
        });
    });

    render('core');
}

function sortPublications(publications) {
    return [...publications].sort((a, b) => {
        const yearA = a.year ? parseInt(a.year) : 9999;
        const yearB = b.year ? parseInt(b.year) : 9999;
        if (yearA !== yearB) return yearB - yearA;

        const venueCompare = getVenueShortName(a.venue, a.year).localeCompare(getVenueShortName(b.venue, b.year));
        if (venueCompare !== 0) return venueCompare;

        return (a.originalIndex || 0) - (b.originalIndex || 0);
    });
}

function isCorePublication(pub) {
    return Boolean(getCoreGroup(pub));
}

function getCoreGroup(pub) {
    const rank = getCCFRank(getVenueFullName(pub.venue, pub.year));
    if (rank === 'A') return 'ccf-a';
    if (rank === 'B') return 'ccf-b';
    if (isTransactionPublication(pub)) return 'trans';
    return null;
}

function isTransactionPublication(pub) {
    const venue = `${pub.venue || ''} ${getVenueFullName(pub.venue, pub.year)}`.toLowerCase();
    return (
        venue.includes('transactions') ||
        venue.includes('transaction') ||
        /\btse\b/i.test(pub.venue || '') ||
        /\btosem\b/i.test(pub.venue || '') ||
        /\btkde\b/i.test(pub.venue || '') ||
        /\btr\b/i.test(pub.venue || '')
    );
}

function getPublicationLevels(pub) {
    const levels = [];
    const rank = getCCFRank(getVenueFullName(pub.venue, pub.year));
    if (rank) levels.push(`ccf-${rank.toLowerCase()}`);
    if (isTransactionPublication(pub) && rank !== 'A' && rank !== 'B') levels.push('trans');
    if (!levels.length) levels.push('other');
    return levels;
}

function resolvePageAssetPath(src) {
    if (!src) return '';
    if (/^(https?:)?\/\//.test(src) || src.startsWith('../') || src.startsWith('/')) return src;
    return window.location.pathname.includes('/pages/') ? `../${src}` : src;
}

function getPublicationLinks(pub) {
    if (Array.isArray(pub.links)) {
        return pub.links.map(link => ({
            label: link.label || link.text || (link.type === 'paper' ? 'PDF' : 'Link'),
            url: link.url || link.link || '#'
        }));
    }

    if (Array.isArray(pub.tags)) {
        return pub.tags.map(tag => ({
            label: tag.text === 'Paper' ? 'PDF' : tag.text,
            url: tag.link || '#'
        }));
    }

    return [];
}

function createPublicationLinks(pub) {
    const fragment = document.createDocumentFragment();

    getPublicationLinks(pub).forEach(linkData => {
        if (!linkData.url || linkData.url === '#') return;

        const link = document.createElement('a');
        link.className = 'publication-link-chip';
        link.href = linkData.url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = linkData.label || 'Link';
        fragment.appendChild(link);
    });

    return fragment;
}

function createPublicationCard(pub) {
    const card = document.createElement('article');
    card.className = 'publication-card';

    const media = document.createElement('div');
    media.className = 'publication-card-media';

    if (pub.thumbnail) {
        const img = document.createElement('img');
        img.src = resolvePageAssetPath(pub.thumbnail);
        img.alt = `${pub.title} thumbnail`;
        media.appendChild(img);
    } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'publication-placeholder';
        placeholder.textContent = getVenueShortName(pub.venue, pub.year);
        media.appendChild(placeholder);
    }

    const body = document.createElement('div');
    body.className = 'publication-card-body';

    const title = document.createElement('h3');
    title.textContent = pub.title;
    body.appendChild(title);

    const authors = document.createElement('p');
    authors.className = 'publication-authors';
    authors.innerHTML = pub.authors;
    body.appendChild(authors);

    const meta = document.createElement('div');
    meta.className = 'publication-meta';

    const venue = document.createElement('span');
    venue.className = 'publication-venue';
    venue.textContent = getVenueShortName(pub.venue, pub.year);
    meta.appendChild(venue);

    const rank = getCCFRank(getVenueFullName(pub.venue, pub.year));
    if (rank) {
        const rankBadge = document.createElement('span');
        rankBadge.className = `publication-rank ccf-${rank.toLowerCase()}`;
        rankBadge.textContent = `CCF-${rank}`;
        meta.appendChild(rankBadge);
    }

    if (pub.highlight) {
        const highlight = document.createElement('span');
        highlight.className = 'publication-highlight';
        highlight.textContent = pub.highlight;
        meta.appendChild(highlight);
    }

    body.appendChild(meta);

    const links = document.createElement('div');
    links.className = 'publication-links';
    links.appendChild(createPublicationLinks(pub));
    body.appendChild(links);

    card.appendChild(media);
    card.appendChild(body);
    return card;
}

function renderCorePublicationCards(container, publications) {
    const corePublications = publications.filter(isCorePublication);

    CORE_GROUPS.forEach(group => {
        const groupPapers = corePublications.filter(pub => getCoreGroup(pub) === group.id);
        if (!groupPapers.length) return;

        const section = document.createElement('section');
        section.className = 'publication-core-group';

        const heading = document.createElement('div');
        heading.className = 'publication-core-heading';

        const title = document.createElement('h3');
        title.textContent = group.label;
        heading.appendChild(title);

        const count = document.createElement('span');
        count.textContent = `${groupPapers.length} ${groupPapers.length === 1 ? 'paper' : 'papers'}`;
        heading.appendChild(count);
        section.appendChild(heading);

        const list = document.createElement('div');
        list.className = 'publication-card-list';
        groupPapers.forEach(pub => list.appendChild(createPublicationCard(pub)));
        section.appendChild(list);

        container.appendChild(section);
    });
}

function initPublicationFilters(publications, onChange) {
    const panel = document.getElementById('publication-filters');
    const state = { topic: 'all', level: 'all', year: 'all' };
    if (!panel) return { panel: null, state };

    const topicContainer = panel.querySelector('[data-filter-group="topic"]');
    const levelSelect = document.getElementById('publication-level-filter');
    const yearSelect = document.getElementById('publication-year-filter');

    if (topicContainer && !topicContainer.dataset.ready) {
        PUBLICATION_TOPIC_FILTERS.forEach(topic => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'publication-filter-chip';
            button.dataset.filterValue = topic.id;
            button.textContent = topic.label;
            button.addEventListener('click', () => {
                state.topic = topic.id;
                updateTopicFilterButtons(topicContainer, state.topic);
                onChange();
            });
            topicContainer.appendChild(button);
        });
        topicContainer.dataset.ready = 'true';
        updateTopicFilterButtons(topicContainer, state.topic);
    }

    if (levelSelect && !levelSelect.dataset.ready) {
        PUBLICATION_LEVEL_FILTERS.forEach(level => {
            const option = document.createElement('option');
            option.value = level.id;
            option.textContent = level.label;
            levelSelect.appendChild(option);
        });
        levelSelect.addEventListener('change', () => {
            state.level = levelSelect.value;
            onChange();
        });
        levelSelect.dataset.ready = 'true';
    }

    if (yearSelect && !yearSelect.dataset.ready) {
        const years = Array.from(new Set(publications.map(pub => pub.year).filter(Boolean))).sort((a, b) => parseInt(b) - parseInt(a));
        [{ id: 'all', label: 'All Years' }, ...years.map(year => ({ id: String(year), label: String(year) }))].forEach(year => {
            const option = document.createElement('option');
            option.value = year.id;
            option.textContent = year.label;
            yearSelect.appendChild(option);
        });
        yearSelect.addEventListener('change', () => {
            state.year = yearSelect.value;
            onChange();
        });
        yearSelect.dataset.ready = 'true';
    }

    return { panel, state };
}

function updateTopicFilterButtons(container, activeTopic) {
    container.querySelectorAll('.publication-filter-chip').forEach(button => {
        button.classList.toggle('active', button.dataset.filterValue === activeTopic);
    });
}

function matchesPublicationFilters(pub, filters) {
    const topics = Array.isArray(pub.topics) ? pub.topics : [];
    const levels = getPublicationLevels(pub);

    return (
        (filters.topic === 'all' || topics.includes(filters.topic)) &&
        (filters.level === 'all' || levels.includes(filters.level)) &&
        (filters.year === 'all' || String(pub.year) === filters.year)
    );
}

function updatePublicationFilterSummary(visibleCount, totalCount) {
    const summary = document.getElementById('publication-filter-summary');
    if (!summary) return;
    summary.textContent = `${visibleCount} / ${totalCount} publications`;
}

function renderFullPublicationList(container, publications) {
    if (!publications.length) {
        const empty = document.createElement('p');
        empty.className = 'publication-empty-state';
        empty.textContent = 'No publications match the selected filters.';
        container.appendChild(empty);
        return;
    }

    const list = document.createElement('ul');
    list.className = 'publication-full-list';

    publications.forEach(pub => {
        const item = document.createElement('li');
        item.className = 'publication-full-item';

        const venue = document.createElement('span');
        venue.className = 'publication-full-venue';
        venue.textContent = getVenueShortName(pub.venue, pub.year);
        item.appendChild(venue);

        const content = document.createElement('div');
        content.className = 'publication-full-content';

        const title = document.createElement('h3');
        title.textContent = pub.title;
        content.appendChild(title);

        const authors = document.createElement('p');
        authors.className = 'publication-authors';
        authors.innerHTML = pub.authors;
        content.appendChild(authors);

        const meta = document.createElement('div');
        meta.className = 'publication-meta';

        const venueName = document.createElement('span');
        venueName.textContent = getVenueFullName(pub.venue, pub.year);
        meta.appendChild(venueName);

        getPublicationLevels(pub).forEach(level => {
            if (level === 'other' || level === 'trans') return;
            const levelChip = document.createElement('span');
            levelChip.className = `publication-rank ${level.startsWith('ccf-') ? level : 'transaction-rank'}`;
            levelChip.textContent = getPublicationLevelLabel(level);
            meta.appendChild(levelChip);
        });

        if (pub.highlight) {
            const highlight = document.createElement('span');
            highlight.className = 'publication-highlight';
            highlight.textContent = pub.highlight;
            meta.appendChild(highlight);
        }

        meta.appendChild(createPublicationLinks(pub));
        content.appendChild(meta);

        const topicWrap = document.createElement('div');
        topicWrap.className = 'publication-topic-list';
        (pub.topics || []).forEach(topic => {
            const topicChip = document.createElement('span');
            topicChip.className = 'publication-topic-chip';
            topicChip.textContent = getPublicationTopicLabel(topic);
            topicWrap.appendChild(topicChip);
        });
        content.appendChild(topicWrap);

        item.appendChild(content);
        list.appendChild(item);
    });

    container.appendChild(list);
}

function getPublicationTopicLabel(topicId) {
    return PUBLICATION_TOPIC_FILTERS.find(topic => topic.id === topicId)?.label || topicId;
}

function getPublicationLevelLabel(levelId) {
    return PUBLICATION_LEVEL_FILTERS.find(level => level.id === levelId)?.label || levelId;
}

function getVenueShortName(venueStr, year) {
    if (!venueStr) return "Preprint";

    // Remove any year digits from venue string
    const s = venueStr.replace(/\d{4}/g, "").trim();
    const y2 = (year && year.toString().length === 4) ? "'" + year.toString().slice(2) : "";

    // arXiv
    if (s.toLowerCase().includes("arxiv")) return "ArXiv";

    // --- SE / Testing / AI4SE common venues ---
    const map = [
        // Journals
        { key: ["IEEE Transactions on Software Engineering", "TSE"], short: "TSE" },
        { key: ["ACM Transactions on Software Engineering and Methodology", "TOSEM"], short: "TOSEM" },
        { key: ["IEEE Transactions on Reliability", "TR"], short: "TR" },
        { key: ["Tsinghua Science and Technology", "TST"], short: "TST" },
        { key: ["Science of Computer Programming", "SCP"], short: "SCP" },
        { key: ["Journal of Systems and Software", "JSS"], short: "JSS" },
        { key: ["Engineering Applications of Artificial Intelligence", "EAAI"], short: "EAAI" },
        { key: ["Applied Soft Computing", "ASC"], short: "ASC" },

        // Conferences
        { key: ["International Conference on Software Engineering", "ICSE"], short: "ICSE", conf: true },
        { key: ["ACM SIGSOFT International Symposium on Software Testing and Analysis", "ISSTA"], short: "ISSTA", conf: true },
        { key: ["International Conference on Automated Software Engineering", "ASE"], short: "ASE", conf: true },
        { key: ["International Conference on Software Testing, Validation and Verification", "ICST"], short: "ICST", conf: true },
        { key: ["ACM Symposium on Applied Computing", "SAC"], short: "SAC", conf: true },
        { key: ["International Conference on Dependable Systems and Their Applications", "DSA"], short: "DSA", conf: true }
    ];

    for (const item of map) {
        if (item.key.some(k => s.includes(k))) {
            // Conference: add year suffix; Journal: no suffix
            return item.short + (item.conf ? y2 : "");
        }
    }

    // Fallback: return cleaned string
    return s;
}

function getVenueFullName(venueStr, year) {
    if (!venueStr) return "";
    const s = venueStr.replace(/\d{4}/g, "").trim();
    const y2 = (year && year.toString().length === 4) ? "'" + year.toString().slice(2) : "";

    if (s.toLowerCase().includes("arxiv")) return "arXiv preprint";

    // Journals (no year suffix)
    if (s.includes("TSE") || s.includes("IEEE Transactions on Software Engineering"))
        return "IEEE Transactions on Software Engineering";
    if (s.includes("TOSEM") || s.includes("ACM Transactions on Software Engineering and Methodology"))
        return "ACM Transactions on Software Engineering and Methodology";
    if (s.includes("TR") || s.includes("IEEE Transactions on Reliability"))
        return "IEEE Transactions on Reliability";
    if (s.includes("TST") || s.includes("Tsinghua Science and Technology"))
        return "Tsinghua Science and Technology";
    if (s.includes("SCP") || s.includes("Science of Computer Programming"))
        return "Science of Computer Programming";
    if (s.includes("JSS") || s.includes("Journal of Systems and Software"))
        return "Journal of Systems and Software";
    if (s.includes("EAAI") || s.includes("Engineering Applications of Artificial Intelligence"))
        return "Engineering Applications of Artificial Intelligence";
    if (s.includes("ASC") || s.includes("Applied Soft Computing"))
        return "Applied Soft Computing";

    // Conferences (with year suffix)
    if (s.includes("ICSE") || s.includes("International Conference on Software Engineering"))
        return `International Conference on Software Engineering (ICSE${y2})`;
    if (s.includes("ISSTA") || s.includes("Software Testing and Analysis"))
        return `International Symposium on Software Testing and Analysis (ISSTA${y2})`;
    if (s.includes("ASE") || s.includes("Automated Software Engineering"))
        return `International Conference on Automated Software Engineering (ASE${y2})`;
    if (s.includes("ICST") || s.includes("Software Testing, Validation and Verification"))
        return `International Conference on Software Testing, Validation and Verification (ICST${y2})`;
    if (s.includes("SAC") || s.includes("Symposium on Applied Computing"))
        return `ACM Symposium on Applied Computing (SAC${y2})`;
    if (s.includes("DSA") || s.includes("Dependable Systems and Their Applications"))
        return `International Conference on Dependable Systems and Their Applications (DSA${y2})`;

    return s;
}

function getCCFRank(fullName) {
    const v = (fullName || "");

    if (
        v.includes("IEEE Transactions on Software Engineering") ||
        v.includes("ACM Transactions on Software Engineering and Methodology")
    ) {
        return "A";
    }

    if (
        v.includes("Science of Computer Programming")
    ) {
        return "B";
    }

    // --- CCF-C (示例：TR 期刊通常不在 CCF SE 列表里；DSA 多为 EI/一般会议) ---
    if (
        v.includes("IEEE Transactions on Reliability") ||
        v.includes("International Conference on Software Testing, Validation and Verification") ||
        v.includes("Engineering Applications of Artificial Intelligence")
    ) {
        return "C";
    }

    return null;
}

// Function to render news items
function renderNewsItems(newsData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('News container not found:', containerId);
        return;
    }
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Add each news item to the container
    newsData.forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        
        // Create the date element
        const dateElement = document.createElement('span');
        dateElement.className = 'news-date';
        dateElement.textContent = newsItem.date;
        
        // Create the content element
        const contentElement = document.createElement('div');
        contentElement.className = 'news-content';
        
        // Create emoji and content text
        const textSpan = document.createElement('span');
        textSpan.innerHTML = '🎉 ' + newsItem.content;
        contentElement.appendChild(textSpan);
        
        // Add links if provided in the links array format
        if (newsItem.links && newsItem.links.length > 0) {
            newsItem.links.forEach(link => {
                const space = document.createTextNode(' ');
                contentElement.appendChild(space);
                
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.textContent = link.text;
                if (link.url && !link.url.startsWith('#')) {
                    linkElement.setAttribute('target', '_blank');
                }
                contentElement.appendChild(linkElement);
            });
        }
        
        // Check for old style link (backward compatibility)
        if (newsItem.link && newsItem.link !== '#' && (!newsItem.links || newsItem.links.length === 0)) {
            const space = document.createTextNode(' ');
            contentElement.appendChild(space);
            
            const linkElement = document.createElement('a');
            linkElement.href = newsItem.link;
            linkElement.textContent = '[Link]';
            linkElement.setAttribute('target', '_blank');
            contentElement.appendChild(linkElement);
        }
        
        newsElement.appendChild(dateElement);
        newsElement.appendChild(contentElement);
        container.appendChild(newsElement);
    });
}

// Function to render honors items
function renderHonorsItems(honorsData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Honors container not found:', containerId);
        return;
    }
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Add each honor item to the container
    honorsData.forEach(honor => {
        const honorElement = document.createElement('div');
        honorElement.className = 'honor-item';
        
        // Year
        const yearElement = document.createElement('div');
        yearElement.className = 'honor-year';
        yearElement.textContent = honor.date;
        
        // Content
        const contentElement = document.createElement('div');
        contentElement.className = 'honor-content';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = honor.title;
        
        const orgElement = document.createElement('p');
        orgElement.className = 'text-sm text-neutral-600';
        orgElement.textContent = honor.org;
        
        contentElement.appendChild(titleElement);
        contentElement.appendChild(orgElement);
        
        honorElement.appendChild(yearElement);
        honorElement.appendChild(contentElement);
        
        container.appendChild(honorElement);
    });
}

// Helper to open all external links in new tab
function makeAllLinksOpenInNewTab() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (link.hostname !== window.location.hostname && link.getAttribute('href') && !link.getAttribute('href').startsWith('#') && !link.getAttribute('href').startsWith('mailto:')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// Helper to setup MutationObserver for dynamically added links
function setupLinkObserver() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'A') {
                            if (node.hostname !== window.location.hostname && node.getAttribute('href') && !node.getAttribute('href').startsWith('#') && !node.getAttribute('href').startsWith('mailto:')) {
                                node.setAttribute('target', '_blank');
                                node.setAttribute('rel', 'noopener noreferrer');
                            }
                        }
                        // Check descendants
                        const links = node.querySelectorAll('a');
                        links.forEach(link => {
                            if (link.hostname !== window.location.hostname && link.getAttribute('href') && !link.getAttribute('href').startsWith('#') && !link.getAttribute('href').startsWith('mailto:')) {
                                link.setAttribute('target', '_blank');
                                link.setAttribute('rel', 'noopener noreferrer');
                            }
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
