(function () {
  function sanitize(value) {
    return (value || "").toString().trim();
  }

  function nonEmpty(value) {
    return sanitize(value).length > 0;
  }

  function buildIssueBody(data) {
    return [
      "## Bug Report",
      "",
      "### Reporter",
      "- Minecraft Username: " + data.minecraftNick,
      "- Discord ID: " + data.discordId,
      "",
      "### Bug Summary",
      "- Severity: " + data.severity,
      "- Category: " + data.category,
      "- Frequency: " + data.frequency,
      "- First occurrence: " + (data.firstSeen || "Not provided"),
      "",
      "### What happened?",
      data.description,
      "",
      "### Steps to reproduce",
      data.steps,
      "",
      "### Expected behavior",
      data.expected || "Not provided",
      "",
      "### Additional notes",
      data.notes || "Not provided",
      "",
      "_Submitted via website report form_",
    ].join("\n");
  }

  function getRepoSlug() {
    var repo = document.body.getAttribute("data-github-repo") || "";
    return sanitize(repo) || "BezejmenyXYZ/bezejmenyxyz.github.io";
  }

  function openIssue(data) {
    var repoSlug = getRepoSlug();
    var params = new URLSearchParams({
      template: "bug-from-web.yml",
      labels: "bug,from-web",
      title: "[Bug] " + data.bugTitle,
      details: buildIssueBody(data),
    });

    var issueUrl = "https://github.com/" + repoSlug + "/issues/new?" + params.toString();
    window.open(issueUrl, "_blank", "noopener");
  }

  function setHint(message, isError) {
    var hint = document.getElementById("submit-hint");
    if (!hint) return;

    hint.textContent = message;
    hint.style.color = isError ? "#ff8080" : "#aaaaaa";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("bug-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var formData = {
        minecraftNick: sanitize(form.minecraftNick.value),
        discordId: sanitize(form.discordId.value),
        bugTitle: sanitize(form.bugTitle.value),
        severity: sanitize(form.severity.value),
        category: sanitize(form.category.value || "General"),
        description: sanitize(form.description.value),
        steps: sanitize(form.steps.value),
        expected: sanitize(form.expected.value),
        firstSeen: sanitize(form.firstSeen.value),
        frequency: sanitize(form.frequency.value || "Unknown"),
        notes: sanitize(form.notes.value),
      };

      if (!nonEmpty(formData.minecraftNick) || !nonEmpty(formData.discordId) || !nonEmpty(formData.bugTitle) || !nonEmpty(formData.severity) || !nonEmpty(formData.description) || !nonEmpty(formData.steps)) {
        setHint("Please fill all required fields before submitting.", true);
        return;
      }

      if (!/^\d{17,20}$/.test(formData.discordId)) {
        setHint("Discord ID should be a numeric ID (17-20 digits).", true);
        return;
      }

      setHint("Opening GitHub issue editor in a new tab...", false);
      openIssue(formData);
    });
  });
})();
