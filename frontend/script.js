document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('itemForm');
    const itemsContainer = document.getElementById('itemsList');

    // Сделаем функции глобальными для доступа из onclick
    window.updateItem = updateItem;
    window.deleteItem = deleteItem;

    // Загрузка элементов при старте
    loadItems();

    // Обработка добавления
    form.addEventListener('submit', e => {
        e.preventDefault();

        const newItem = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value
        };

        fetch('/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            loadItems();
        });
    });

    // Загрузка элементов
    function loadItems() {
        fetch('/items')
            .then(response => response.json())
            .then(items => {
                itemsContainer.innerHTML = '';
                items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'item';
                    itemDiv.innerHTML = `
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <small>ID: ${item.id}</small>
                        <div class="actions">
                            <button onclick="updateItem(${item.id})">Edit</button>
                            <button onclick="deleteItem(${item.id})">Delete</button>
                        </div>
                    `;
                    itemsContainer.appendChild(itemDiv);
                });
            });
    }
    
    function updateItem(id) {
        const newTitle = prompt("Enter new title:");
        const newDescription = prompt("Enter new description:");

        if (newTitle) {
            fetch(`/update-item?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription
                })
            })
            .then(response => {
                if (response.ok) loadItems();
                else alert("Update failed");
            });
        }
    }

    function deleteItem(id) {
        if (confirm("Are you sure you want to delete this item?")) {
            fetch(`/delete-item?id=${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) loadItems();
                else alert("Delete failed");
            });
        }
    }
});
