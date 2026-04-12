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
    const grid1 = document.getElementById('grid1');
    const grid2 = document.getElementById('grid2');
    
    grid1.innerHTML = '';
    grid2.innerHTML = '';

    mediaData.forEach((media, index) => {
        const item = createMediaItem(media, index);
        if (media.id <= 5) {
            grid1.appendChild(item);
        } else {
            grid2.appendChild(item);
        }
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
