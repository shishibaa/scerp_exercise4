 const form = document.getElementById("edit-form");
        const id = document.getElementById("id");
        const title = document.getElementById("title");
        const bio = document.getElementById("bio");
        const website = document.getElementById("website");
        const graduate = document.getElementById("graduate");
        const params = new URLSearchParams(window.location.search);
        const memberId = params.get("id");

        async function loadMember() {
            try {
                const res = await fetch(`https://api.tsukijou.dev/members/${encodeURIComponent(memberId)}`);
                if (!res.ok) throw new Error("Failed to fetch member");
                const member = await res.json();
                id.value = member.id ;
                title.value = member.title;
                bio.value = member.bio ;
                website.value = member.website;
                graduate.value = member.graduated ? "true" : "false";
            } catch (err) {
                alert("Error: " + err.message);
            }
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                id: id.value.trim(),
                title: title.value.trim(),
                bio: bio.value.trim(),
                website: website.value.trim() || null,
                graduated: graduate.value === "true"
            };

            try {
                const res = await fetch(`https://api.tsukijou.dev/members/${encodeURIComponent(memberId)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if(res.ok) alert("Member updated successfully!");
                
                else throw new Error("Failed to update member");
                window.location.href = "index.html";

            } catch (err) {
                alert("Error: " + err.message);
            }
        });

        if (memberId) loadMember();
        else alert("No member ID provided");