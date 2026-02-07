const API_URL = "http://localhost:3000/api/notes";

const form = document.getElementById('noteform');
const notediv = document.getElementById('notes');

async function fetchNotes() {
    const res = await fetch(API_URL);
    const data = await res.json()
    console.log(data);
    notediv.innerHTML = "";

    data.data.forEach(note=> {
        const div = document.createElement('div');
        div.className = 'note';
        div.innerHTML = `<h3>${note.title}</h3> <p>${note.content}</p>`;
        notediv.appendChild(div);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    });

    form.reset();
    fetchNotes();
});

fetchNotes();