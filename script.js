const memberList = document.getElementById("memberList");
const searchForm = document.getElementById("search-form")
const searchInput = document.getElementById("search-input");
let members = [];

async function getMember() {
    try {
        const response = await fetch("https://api.tsukijou.dev/members");
        if (!response.ok) {
            alert("Failed to fetch member data");
            return;
        }
        const jsonData = await response.json();
        saveList(jsonData);
    } catch (error) {
        alert("An error occurred while fetching member data");
        console.error(error);
        return
    }
}

function saveList(list) {
    members = list;
    renderList(members);
}

function escapeHtml(s) {
    return String(s ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function isValidHttpUrl(url, { httpsOnly = false } = {}) {
    try {
        const u = new URL(url);
        if (httpsOnly) return u.protocol === "https:";
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

function renderList(list) {
    memberList.textContent = "";
    const div = document.createElement("div");

    if (!list.length) {
        div.textContent = "Member Not Found";
        memberList.appendChild(div);
        return;
    }


    list.forEach(member => {
        const div = document.createElement("div");
        const id = member.id ?? "";
        const title = member.title ?? "";
        const bio = member.bio ?? "";
        const graduated = member.graduated === true ? "Graduated" : "Undergraduate";
        let websiteHtml = `<a href="#" class="visit-btn" id="visit-err">Visit</a>`;
        if (member.website && isValidHttpUrl(member.website)) {
            const safeHref = escapeHtml(member.website);
            websiteHtml = `<a  class="visit-btn"  id="visit-link" href="${safeHref}" target="_blank" rel="noopener noreferrer">Visit</a>`;
        }
        div.innerHTML = `
                                <div class="member-card">
                                 <div class="action-bar">
                                <li>
                                    <a class="edit-btn" href="edit.html?id=${encodeURIComponent(id)}">
                                    <svg id="edit-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                                    </svg>
                                    </a>
                                    <a class="delete-btn" data-id="${escapeHtml(id)}" href="#">
                                    <svg id="del-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                    </a>
                                </li>
                                </div>
                                <h1 class="id"> ${escapeHtml(id)}</h1>
                                <h2 class="title"> ${escapeHtml(title)}</h2>
                                <p class="graduated"> (${graduated})</p>
                                <div class = "bio-wrapper"><p class="bio"> ${escapeHtml(bio)}</p></div>
                                <p class="website">
                                ${websiteHtml}
                                </p>
                                </div>
                                `
        memberList.appendChild(div)
    });

}

memberList.addEventListener("click", async (e) => {
    const visitErr = e.target.closest("a#visit-err");
    if (visitErr) {
        e.preventDefault();
        alert("The website is under construction");
        return;
    }

    const delBtn = e.target.closest(".delete-btn");
    if (delBtn) {
        e.preventDefault();
        const id = delBtn.dataset.id;
        if (!id) return;
        const ok = confirm(`Delete member "${id}"?`);
        if (!ok) return;

        try {
            const res = await fetch(`https://api.tsukijou.dev/members/${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: { "Accept": "application/json" }
            });
            if (!res.ok) {
                throw new Error(`Failed to delete (status ${res.status})`);
            }

            members = members.filter(m => m.id !== id);
            renderList(members);
        } catch (err) {
            alert("Error: " + err.message);
        }
    }
});

function searchMember() {
    const sInput = (searchInput.value || "").trim().toLowerCase();
    if (!sInput) {
        renderList(members);
        return;
    }
    const filtered = members.filter(member =>
        (member.id || "").toLowerCase().includes(sInput)
    );
    renderList(filtered);
}

searchInput.addEventListener('input', searchMember);
getMember();



