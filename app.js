let gameData = [];
let personalData = [];

async function loadData() {
    try {
        const [gameRes, linksRes] = await Promise.all([
            fetch('media/index.json'),
            fetch('media/links.json')
        ]);
        gameData = await gameRes.json();
        personalData = await linksRes.json();
        renderPage();
    } catch (error) {
        console.error('Error loading media:', error);
    }
}

function renderPage() {
    const main = document.querySelector('main');
    main.innerHTML = '';

    main.appendChild(buildSection('Game Commissions', 'gameGrid', gameData));
    main.appendChild(buildSection('Personal Work', 'personalGrid', personalData));
}

function buildSection(title, gridId, data) {
    const section = document.createElement('section');
    section.id = gridId + 'Section';

    const heading = document.createElement('h2');
    heading.className = 'section-title';
    heading.textContent = title;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'media-grid';
    grid.id = gridId;
    section.appendChild(grid);

    data.forEach((media) => {
        grid.appendChild(createMediaItem(media));
    });

    return section;
}

function mediaMarkup(media, { interactive } = { interactive: false }) {
    if (media.type === 'video') {
        const controls = interactive ? 'controls' : '';
        const autoplay = interactive ? 'autoplay' : 'autoplay muted loop';
        return `<video ${controls} ${autoplay}><source src="${media.file}" type="video/mp4"></video>`;
    } else if (media.type === 'image' || media.type === 'gif') {
        return `<img src="${media.file}" alt="${media.title}">`;
    } else if (media.type === 'embed') {
        const pointerEvents = interactive ? '' : 'style="pointer-events:none;"';
        return `<iframe src="${media.embedUrl}" ${pointerEvents} frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    }
    return '';
}

function createMediaItem(media) {
    const item = document.createElement('div');
    item.className = 'media-item';
    item.onclick = () => openModal(media);

    item.innerHTML = `
        ${mediaMarkup(media, { interactive: false })}
        <div class="media-item-label">
            <div class="media-item-title">${media.title}</div>
            <div class="media-item-duration">${media.duration}</div>
        </div>
    `;

    return item;
}

function openModal(media) {
    const modal = document.getElementById('modal');
    const modalMedia = document.getElementById('modal-media');
    const modalInfo = document.getElementById('modal-info');

    modalMedia.innerHTML = mediaMarkup(media, { interactive: true });

    const linkHTML = media.link
        ? `<p><a href="${media.link}" target="_blank" class="modal-external-link">View original ↗</a></p>`
        : '';

    modalInfo.innerHTML = `
        <h2>${media.title}</h2>
        <p>${media.description}</p>
        ${linkHTML}
    `;

    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.getElementById('modal-media').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('modalCloseBtn').onclick = closeModal;

    document.getElementById('modal').onclick = (e) => {
        if (e.target === document.getElementById('modal')) closeModal();
    };

    document.getElementById('openContact').onclick = (e) => {
        e.preventDefault();
        document.getElementById('contactModal').style.display = 'flex';
    };

    document.getElementById('closeContact').onclick = () => {
        document.getElementById('contactModal').style.display = 'none';
    };

    document.getElementById('contactModal').onclick = (e) => {
        if (e.target === document.getElementById('contactModal')) {
            document.getElementById('contactModal').style.display = 'none';
        }
    };

    loadData();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        document.getElementById('contactModal').style.display = 'none';
    }
});