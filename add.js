  const form = document.getElementById("edit-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        id: document.getElementById("id").value.trim(),
        title: document.getElementById("title").value.trim(),
        bio: document.getElementById("bio").value.trim(),
        website: document.getElementById("website").value.trim() || null,
        graduated: document.getElementById("graduate").value === "true"
      };

      try {
        const res = await fetch("https://api.tsukijou.dev/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Failed to add member");

        window.location.href = "index.html";
      } catch (err) {
        alert("Error: " + err.message);
      }
    });