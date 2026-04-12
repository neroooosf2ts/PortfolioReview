let mediaData = [];

async function loadMedia() {
    try {
        const response = await fetch('media/index.json');
        mediaData = await response.json();
        renderGrids();
    } catch (error) {
        console.error('Error loading media:', error);
    }
}

function renderGrids() {
    const main = document.querySelector('main');
    main.innerHTML = '';

    const sectionCount = Math.ceil(mediaData.length / 5);

    for (let s = 0; s < sectionCount; s++) {
        const section = document.createElement('section');
        section.id = `section${s + 1}`;

        const grid = document.createElement('div');
        grid.className = 'media-grid';
        grid.id = `grid${s + 1}`;

        section.appendChild(grid);
        main.appendChild(section);
    }

    mediaData.forEach((media, index) => {
        const sectionIndex = Math.floor(index / 5);
        const grid = document.getElementById(`grid${sectionIndex + 1}`);
        const item = createMediaItem(media, index);
        grid.appendChild(item);
    });
}

function createMediaItem(media, index) {
    const item = document.createElement('div');
    item.className = 'media-item';
    item.onclick = () => openModal(index);

    let mediaHTML = '';
    if (media.type === 'video') {
        mediaHTML = `<video autoplay muted loop><source src="${media.file}" type="video/mp4"></video>`;
    } else if (media.type === 'image' || media.type === 'gif') {
        mediaHTML = `<img src="${media.file}" alt="${media.title}">`;
    }

    item.innerHTML = `
        ${mediaHTML}
        <div class="media-item-label">
            <div class="media-item-title">${media.title}</div>
            <div class="media-item-duration">${media.duration}</div>
        </div>
    `;

    return item;
}

function openModal(index) {
    const media = mediaData[index];
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    let mediaHTML = '';
    if (media.type === 'video') {
        mediaHTML = `<video controls style="width: 100%; height: auto;"><source src="${media.file}" type="video/mp4"></video>`;
    } else if (media.type === 'image' || media.type === 'gif') {
        mediaHTML = `<img src="${media.file}" alt="${media.title}" style="width: 100%; height: auto;">`;
    }

    modalBody.innerHTML = `
        ${mediaHTML}
        <h2>${media.title}</h2>
        <p>${media.description}</p>
    `;

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.close').onclick = closeModal;
    document.getElementById('modal').onclick = (e) => {
        if (e.target === document.getElementById('modal')) closeModal();
    };
    loadMedia();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
