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
        const graduated = member.graduated === true ? "Graduated" : "Not Graduated";
        let websiteHtml = `<a href="#" class="visit-err">Visit</a>`;
        if (member.website && isValidHttpUrl(member.website)) {
            const safeHref = escapeHtml(member.website);
            websiteHtml = `<a class="visit-link" href="${safeHref}" target="_blank" rel="noopener noreferrer">Visit</a>`;
        }
        div.innerHTML = `
                                <div class="member-card">
                                <h1 class="id"> ${escapeHtml(member.id)}</h1>
                                <h2 class="title"> ${escapeHtml(member.title)}</h2>
                                <p class="graduated"> (${graduated})</p>
                                <div class = "bio-wrapper"><p class="bio"> ${escapeHtml(member.bio)}</p></div>
                                <p class="website">${websiteHtml}</p>

                                </div>
                                `
        memberList.appendChild(div)
    });

}

memberList.addEventListener("click", (e) => {
    const a = e.target.closest('a.visit-err');
    if (a) {
        e.preventDefault();
        alert("The website is under construction");
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
