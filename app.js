let mediaData = [];

async function loadMedia() {
    try {
        const res = await fetch('media/index.json');
        mediaData = await res.json();
        renderGrid();
    } catch (err) {
        console.error('Failed to load media:', err);
    }
}

function renderGrid() {
    const main = document.getElementById('main');
    main.innerHTML = '';

    const sectionCount = Math.ceil(mediaData.length / 3);
    for (let s = 0; s < sectionCount; s++) {
        const section = document.createElement('section');
        mediaData.slice(s * 3, s * 3 + 3).forEach((media, i) => {
            section.appendChild(createItem(media, s * 3 + i));
        });
        main.appendChild(section);
    }
}

function createItem(media, index) {
    const item = document.createElement('div');
    item.className = 'media-item';
    item.addEventListener('click', () => openModal(index));

    const mediaHTML = media.type === 'video'
        ? `<video autoplay muted loop playsinline><source src="${media.file}" type="video/mp4"></video>`
        : `<img src="${media.file}" alt="${media.title}" loading="lazy">`;

    item.innerHTML = `
        ${mediaHTML}
        <div class="media-label">
            <div class="media-title">${media.title}</div>
            <div class="media-duration">${media.duration}</div>
        </div>
    `;
    return item;
}

function openModal(index) {
    const media = mediaData[index];
    const mediaHTML = media.type === 'video'
        ? `<video controls autoplay playsinline><source src="${media.file}" type="video/mp4"></video>`
        : `<img src="${media.file}" alt="${media.title}">`;

    document.getElementById('modal-media').innerHTML = mediaHTML;
    document.getElementById('modal-info').innerHTML = `<h2>${media.title}</h2><p>${media.description}</p>`;
    document.getElementById('modal').classList.add('open');
}

function closeModal() {
    document.getElementById('modal').classList.remove('open');
    document.getElementById('modal-media').innerHTML = '';
}

function closeContact() {
    document.getElementById('contactModal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', e => {
        if (e.target === document.getElementById('modal')) closeModal();
    });

    document.getElementById('openContact').addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('contactModal').classList.add('open');
    });

    document.getElementById('closeContact').addEventListener('click', closeContact);
    document.getElementById('contactModal').addEventListener('click', e => {
        if (e.target === document.getElementById('contactModal')) closeContact();
    });

    loadMedia();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeContact(); }
});
