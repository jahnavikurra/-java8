VSS.init({
    explicitNotifyLoaded: true,
    usePlatformScripts: true
});

VSS.ready(function () {
    console.log("Azure DevOps SDK Ready");

    const BASE_URL = "https://ai-aca-agt-prj0067566-wrkitm-bkd.orangeglacier-f13d9e59.eastus.azurecontainerapps.io";
    const GENERATE_URL = `${BASE_URL}/generate`;
    const TEST_CORS_URL = `${BASE_URL}/cors-test`;

    const webContext = VSS.getWebContext();
    const projectName = webContext.project ? webContext.project.name : "";

    const notesEl = document.getElementById("notes");
    const charCountEl = document.getElementById("charCount");
    const ideasListEl = document.getElementById("ideasList");

    if (notesEl && charCountEl) {
        notesEl.addEventListener("input", function () {
            charCountEl.innerText = `${notesEl.value.length} characters`;
        });
    }

    document.getElementById("btnTestCors").addEventListener("click", async function () {
        setStatus("Testing CORS...");
        try {
            const response = await fetch(TEST_CORS_URL, { method: "GET" });
            const text = await response.text();
            console.log("CORS response:", text);
            setStatus("CORS working.");
        } catch (error) {
            console.error(error);
            setStatus("CORS test failed.");
        }
    });

    document.getElementById("btnGenerate").addEventListener("click", async function () {
        const notes = notesEl.value.trim();
        const mode = document.getElementById("mode").value;
        const witType = document.getElementById("witType").value;

        if (!notes) {
            setStatus("Please enter notes before generating.");
            return;
        }

        setStatus("Generating preview...");

        try {
            const response = await fetch(GENERATE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    notes: notes,
                    work_item_type: witType,
                    create_in_ado: false,
                    project_name: projectName,
                    mode: mode
                })
            });

            const rawText = await response.text();
            let data = JSON.parse(rawText);

            if (!response.ok) {
                throw new Error(data.detail || `HTTP ${response.status}`);
            }

            document.getElementById("apiResponse").textContent = JSON.stringify(data, null, 2);

            const generated = data.generated || data;

            document.getElementById("prevTitle").innerText = generated.title || "";
            document.getElementById("prevDesc").innerText = generated.description || "";

            const acList = document.getElementById("prevAc");
            acList.innerHTML = "";
            (generated.acceptanceCriteria || []).forEach(item => {
                const li = document.createElement("li");
                li.innerText = item;
                acList.appendChild(li);
            });

            const taskList = document.getElementById("prevTasks");
            taskList.innerHTML = "";
            (generated.tasks || []).forEach(item => {
                const li = document.createElement("li");
                li.innerText = item;
                taskList.appendChild(li);
            });

            document.getElementById("prevTags").innerText =
                Array.isArray(generated.tags) ? generated.tags.join(", ") : (generated.tags || "");

            renderIdeas([
                generated.title || "Generated work item draft"
            ]);

            document.getElementById("btnCreate").disabled = false;
            setStatus("Preview generated successfully.");
        } catch (error) {
            console.error(error);
            setStatus("Error calling AI backend.");
            document.getElementById("apiResponse").textContent = "Error: " + error.message;
        }
    });

    VSS.notifyLoadSucceeded();

    function renderIdeas(ideas) {
        ideasListEl.innerHTML = "";

        if (!ideas || ideas.length === 0) {
            ideasListEl.innerHTML = `<div class="empty-state">No ideas generated yet.</div>`;
            return;
        }

        ideas.forEach((idea, index) => {
            const row = document.createElement("div");
            row.className = "idea-item";
            row.innerHTML = `
                <div class="idea-title">${escapeHtml(idea)}</div>
                <div class="idea-subtext">Suggestion ${index + 1}</div>
            `;
            ideasListEl.appendChild(row);
        });
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
});

function setStatus(message) {
    document.getElementById("status").innerText = message;
}
