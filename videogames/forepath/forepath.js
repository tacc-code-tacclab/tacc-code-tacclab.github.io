(() => {
  "use strict";

  const BUILD = "2026.08.06-1";
  const SCHEMA_VERSION = "forepath-session/1.0";
  const CONSENT_VERSION = "2026-08-06-pilot-1";
  const PRACTICE_TRIALS = 2;
  const EXPERIMENT_TRIALS = 18;
  const TOTAL_TRIALS = PRACTICE_TRIALS + EXPERIMENT_TRIALS;
  const APPROACH_MS = 2400;
  const FEEDBACK_MS = 2300;
  const DRAND_CHAIN = "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971";
  const DRAND_NETWORK = "quicknet";
  const DRAND_RELAYS = ["https://api.drand.sh", "https://api2.drand.sh", "https://api3.drand.sh"];
  const DB_NAME = "forepath-pilot";
  const DB_STORE = "sessions";

  const screens = Array.from(document.querySelectorAll(".screen"));
  const introScreen = document.querySelector("#intro-screen");
  const questionnaireScreen = document.querySelector("#questionnaire-screen");
  const instructionsScreen = document.querySelector("#instructions-screen");
  const gameScreen = document.querySelector("#game-screen");
  const resultsScreen = document.querySelector("#results-screen");
  const stoppedScreen = document.querySelector("#stopped-screen");
  const participantForm = document.querySelector("#participant-form");
  const formError = document.querySelector("#form-error");
  const participantIdPreview = document.querySelector("#participant-id-preview");
  const trialKind = document.querySelector("#trial-kind");
  const trialLabel = document.querySelector("#trial-label");
  const progressBar = document.querySelector("#progress-bar");
  const stageMessage = document.querySelector("#stage-message");
  const beaconState = document.querySelector("#beacon-state");
  const responseCard = document.querySelector("#response-card");
  const dangerRating = document.querySelector("#danger-rating");
  const dangerOutput = document.querySelector("#danger-output");
  const confidenceRating = document.querySelector("#confidence-rating");
  const confidenceOutput = document.querySelector("#confidence-output");
  const choiceButtons = Array.from(document.querySelectorAll(".choice-button"));
  const soundToggle = document.querySelector("#sound-toggle");
  const fullscreenToggle = document.querySelector("#fullscreen-toggle");
  const stopButton = document.querySelector("#stop-study");
  const canvas = document.querySelector("#forest-canvas");
  const ctx = canvas.getContext("2d", { alpha: false });

  let session = null;
  let currentTrialIndex = 0;
  let currentTrial = null;
  let pendingTrial = null;
  let phase = "idle";
  let phaseTimer = 0;
  let runToken = 0;
  let responseSide = null;
  let soundOn = false;
  let audioContext = null;
  let ambientNodes = [];
  let idbPromise = null;
  let animationFrame = 0;

  const scene = {
    phase: "idle",
    phaseStarted: performance.now(),
    choice: null,
    safeSide: null,
    feedback: null,
    seed: 1
  };

  const treeLayout = Array.from({ length: 38 }, (_, index) => ({
    side: index % 2 === 0 ? -1 : 1,
    depth: ((index * 37) % 97) / 97,
    spread: 0.58 + ((index * 19) % 31) / 34,
    lean: (((index * 13) % 17) - 8) / 130
  }));

  function showScreen(screen) {
    screens.forEach((item) => {
      const active = item === screen;
      item.hidden = !active;
      item.classList.toggle("active", active);
    });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function isoNow() {
    return new Date().toISOString();
  }

  function randomHex(byteLength) {
    const bytes = new Uint8Array(byteLength);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
    }
    return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  }

  function createParticipantId() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `FP-${date}-${randomHex(4).toUpperCase()}`;
  }

  function viewportBucket() {
    const shortest = Math.min(window.innerWidth, window.innerHeight);
    if (shortest < 430) return "small";
    if (shortest < 800) return "medium";
    return "large";
  }

  function coarseDeviceType() {
    const touch = navigator.maxTouchPoints > 0;
    if (touch && Math.min(window.innerWidth, window.innerHeight) < 600) return "phone";
    if (touch) return "tablet-or-touch-computer";
    return "computer";
  }

  function createSession(formData) {
    const participantId = createParticipantId();
    return {
      schema_version: SCHEMA_VERSION,
      build: BUILD,
      study: {
        id: "FOREPATH-PILOT-01",
        title: "FOREPATH — Feeling the Path Before It Exists",
        status: "exploratory_browser_pilot",
        hypothesis_scope: "anomalous anticipation / presentiment; not an individual diagnostic",
        practice_trials: PRACTICE_TRIALS,
        experimental_trials_planned: EXPERIMENT_TRIALS,
        feedback_design: "independent post-choice assignment; revealed vs masked",
        randomisation_design: "future drand quicknet round; browser cryptographic fallback is flagged"
      },
      participant: {
        id: participantId,
        age_band: formData.get("age_band"),
        gaming_frequency: formData.get("gaming_frequency"),
        alertness_1_to_5: Number(formData.get("alertness")),
        snake_discomfort_1_to_5: Number(formData.get("snake_discomfort")),
        intuition_expectation_1_to_5: Number(formData.get("intuition_expectation")),
        prior_participation: formData.get("prior_participation")
      },
      consent: {
        version: CONSENT_VERSION,
        accepted_at_utc: isoNow(),
        adult_confirmed: formData.get("adult_confirmed") === "on",
        study_consent_confirmed: formData.get("consent_confirmed") === "on",
        local_data_confirmed: formData.get("local_data_confirmed") === "on"
      },
      technical: {
        device_type: coarseDeviceType(),
        viewport_bucket: viewportBucket(),
        touch_capable: navigator.maxTouchPoints > 0,
        language: navigator.language || "unknown",
        reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        web_crypto_available: Boolean(window.crypto && window.crypto.getRandomValues),
        indexed_db_available: "indexedDB" in window,
        drand_network: DRAND_NETWORK,
        drand_chain_hash: DRAND_CHAIN
      },
      session: {
        started_at_utc: isoNow(),
        updated_at_utc: isoNow(),
        completed_at_utc: null,
        status: "consented",
        fullscreen_used: false,
        sound_ever_enabled: soundOn,
        visibility_interruptions: 0,
        manual_stops: 0
      },
      trials: [],
      pending_trial: null,
      summary: null,
      quality_flags: []
    };
  }

  function openDatabase() {
    if (idbPromise) return idbPromise;
    idbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB unavailable"));
        return;
      }
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE, { keyPath: "participant.id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB failed"));
    });
    return idbPromise;
  }

  async function saveSession() {
    if (!session) return;
    session.session.updated_at_utc = isoNow();
    session.pending_trial = pendingTrial ? structuredCloneSafe(pendingTrial) : null;
    try {
      const db = await openDatabase();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(DB_STORE, "readwrite");
        transaction.objectStore(DB_STORE).put(structuredCloneSafe(session));
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error("IndexedDB write failed"));
      });
    } catch (_) {
      try {
        localStorage.setItem(`forepath:${session.participant.id}`, JSON.stringify(session));
      } catch (error) {
        if (!session.quality_flags.includes("local_persistence_failed")) session.quality_flags.push("local_persistence_failed");
      }
    }
  }

  async function deleteStoredSession() {
    if (!session) return;
    try {
      const db = await openDatabase();
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(DB_STORE, "readwrite");
        transaction.objectStore(DB_STORE).delete(session.participant.id);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error("IndexedDB delete failed"));
      });
    } catch (_) {
      // The localStorage fallback is removed below.
    }
    try {
      localStorage.removeItem(`forepath:${session.participant.id}`);
    } catch (_) {
      // Nothing else to delete.
    }
  }

  function structuredCloneSafe(value) {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function clearPhaseTimer() {
    if (phaseTimer) window.clearTimeout(phaseTimer);
    phaseTimer = 0;
  }

  function schedule(callback, delay) {
    clearPhaseTimer();
    phaseTimer = window.setTimeout(callback, delay);
  }

  function setScene(nextPhase, details = {}) {
    scene.phase = nextPhase;
    scene.phaseStarted = performance.now();
    Object.assign(scene, details);
  }

  function setStageMessage(overline, message) {
    stageMessage.innerHTML = `<span class="stage-overline">${overline}</span><strong>${message}</strong>`;
  }

  function setResponseVisible(visible) {
    responseCard.setAttribute("aria-hidden", visible ? "false" : "true");
    responseCard.querySelectorAll("input, button").forEach((control) => { control.disabled = !visible; });
  }

  function setBeaconVisible(visible) {
    beaconState.hidden = !visible;
  }

  function resetRatings() {
    dangerRating.value = "50";
    confidenceRating.value = "50";
    dangerOutput.value = "50";
    confidenceOutput.value = "50";
    responseSide = null;
  }

  function beginTrial() {
    clearPhaseTimer();
    runToken += 1;
    const token = runToken;
    const practice = currentTrialIndex < PRACTICE_TRIALS;
    const withinBlock = practice ? currentTrialIndex + 1 : currentTrialIndex - PRACTICE_TRIALS + 1;
    const blockTotal = practice ? PRACTICE_TRIALS : EXPERIMENT_TRIALS;

    phase = "approach";
    currentTrial = {
      trial_index_all: currentTrialIndex + 1,
      trial_index_experimental: practice ? null : withinBlock,
      practice,
      started_at_utc: isoNow(),
      response_opened_at_utc: null,
      choice_at_utc: null,
      choice: null,
      choice_rt_ms: null,
      danger_rating_0_to_100: null,
      confidence_0_to_100: null,
      danger_slider_changes: 0,
      confidence_slider_changes: 0,
      pointer_side_changes: 0,
      visibility_interrupted: false,
      quality_flags: []
    };

    trialKind.textContent = practice ? "PRACTICE" : "EXPERIMENT";
    trialLabel.textContent = `Path ${withinBlock} of ${blockTotal}`;
    const progress = practice ? (withinBlock - 1) / blockTotal : (withinBlock - 1) / blockTotal;
    progressBar.style.width = `${Math.max(0, progress * 100)}%`;
    resetRatings();
    setResponseVisible(false);
    setBeaconVisible(false);
    stopButton.disabled = false;
    setStageMessage("APPROACH", practice ? "Learn the rhythm of the path." : "Let the path come to you.");
    setScene("approach", { choice: null, safeSide: null, feedback: null, seed: currentTrialIndex + 7 });
    schedule(() => {
      if (token === runToken && phase === "approach") openResponse();
    }, APPROACH_MS);
  }

  function openResponse() {
    phase = "response";
    currentTrial.response_opened_at_utc = isoNow();
    currentTrial.response_opened_perf_ms = Math.round(performance.now());
    setScene("fork");
    setStageMessage("THE FORK", "Rate the feeling. Then choose.");
    setResponseVisible(true);
  }

  function onPointerObservation(event) {
    if (phase !== "response" || !currentTrial) return;
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : bounds.left + bounds.width / 2);
    const nextSide = x < bounds.left + bounds.width / 2 ? "left" : "right";
    if (responseSide && responseSide !== nextSide) currentTrial.pointer_side_changes += 1;
    responseSide = nextSide;
  }

  async function choosePath(choice, source = "button") {
    if (phase !== "response" || !currentTrial) return;
    phase = "resolving";
    stopButton.disabled = false;
    currentTrial.choice = choice;
    currentTrial.choice_source = source;
    currentTrial.choice_at_utc = isoNow();
    currentTrial.choice_rt_ms = Math.max(0, Math.round(performance.now() - currentTrial.response_opened_perf_ms));
    delete currentTrial.response_opened_perf_ms;
    currentTrial.danger_rating_0_to_100 = Number(dangerRating.value);
    currentTrial.confidence_0_to_100 = Number(confidenceRating.value);
    currentTrial.assignment_request_at_utc = isoNow();
    pendingTrial = currentTrial;
    session.pending_trial = structuredCloneSafe(pendingTrial);
    setResponseVisible(false);
    setBeaconVisible(true);
    setStageMessage("CHOICE LOCKED", "The future is being assigned now.");
    setScene("resolving", { choice });
    playTone("lock");
    void saveSession();

    const token = runToken;
    try {
      const assignment = currentTrial.practice ? await practiceAssignment() : await futureAssignment();
      if (token !== runToken || phase !== "resolving") return;
      completeAssignment(assignment);
    } catch (error) {
      if (token !== runToken || phase !== "resolving") return;
      completeAssignment(cryptoFallbackAssignment(error));
    }
  }

  function practiceAssignment() {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        const randomness = randomHex(32);
        resolve({
          random_source: "practice_webcrypto",
          randomness,
          beacon: null,
          safe_side: parseInt(randomness.slice(0, 2), 16) % 2 === 0 ? "left" : "right",
          feedback_condition: "revealed"
        });
      }, 650);
    });
  }

  async function fetchJson(url, timeoutMs = 4000) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { mode: "cors", cache: "no-store", credentials: "omit", signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function fetchLatestBeacon() {
    const failures = [];
    for (const relay of DRAND_RELAYS) {
      try {
        const data = await fetchJson(`${relay}/${DRAND_CHAIN}/public/latest`);
        if (!Number.isInteger(data.round) || typeof data.randomness !== "string") throw new Error("Invalid latest beacon");
        return { data, relay };
      } catch (error) {
        failures.push(`${relay}:${error.message}`);
      }
    }
    throw new Error(`All drand relays failed (${failures.join(" | ")})`);
  }

  async function fetchFutureRound(relay, round) {
    const deadline = Date.now() + 12000;
    const relays = [relay, ...DRAND_RELAYS.filter((item) => item !== relay)];
    let lastError = null;
    while (Date.now() < deadline) {
      for (const candidate of relays) {
        try {
          const data = await fetchJson(`${candidate}/${DRAND_CHAIN}/public/${round}`, 2500);
          if (data.round !== round || typeof data.randomness !== "string" || typeof data.signature !== "string") {
            throw new Error("Invalid future beacon");
          }
          return { data, relay: candidate };
        } catch (error) {
          lastError = error;
        }
      }
      await new Promise((resolve) => window.setTimeout(resolve, 550));
    }
    throw lastError || new Error("Future beacon timed out");
  }

  async function futureAssignment() {
    const requestStarted = isoNow();
    const latest = await fetchLatestBeacon();
    const targetRound = latest.data.round + 3;
    const targetSelectedAt = isoNow();
    const future = await fetchFutureRound(latest.relay, targetRound);
    const randomness = future.data.randomness.toLowerCase();
    const firstByte = parseInt(randomness.slice(0, 2), 16);
    const secondByte = parseInt(randomness.slice(2, 4), 16);
    if (!Number.isFinite(firstByte) || !Number.isFinite(secondByte)) throw new Error("Malformed beacon randomness");

    return {
      random_source: "drand_quicknet_future_round",
      randomness,
      safe_side: firstByte % 2 === 0 ? "left" : "right",
      feedback_condition: secondByte % 2 === 0 ? "revealed" : "masked",
      beacon: {
        network: DRAND_NETWORK,
        chain_hash: DRAND_CHAIN,
        latest_round_observed: latest.data.round,
        target_round: targetRound,
        target_selected_at_utc: targetSelectedAt,
        request_started_at_utc: requestStarted,
        fetched_at_utc: isoNow(),
        relay: future.relay,
        randomness,
        signature: future.data.signature,
        previous_signature: future.data.previous_signature || null,
        locally_verified_signature: false,
        audit_note: "Round, randomness and signature are stored for independent verification; this lightweight pilot does not perform BLS verification in-browser."
      }
    };
  }

  function cryptoFallbackAssignment(error) {
    const randomness = randomHex(32);
    return {
      random_source: "browser_webcrypto_fallback",
      randomness,
      safe_side: parseInt(randomness.slice(0, 2), 16) % 2 === 0 ? "left" : "right",
      feedback_condition: parseInt(randomness.slice(2, 4), 16) % 2 === 0 ? "revealed" : "masked",
      beacon: null,
      fallback_error: String(error && error.message ? error.message : error).slice(0, 300)
    };
  }

  function completeAssignment(assignment) {
    const trial = pendingTrial;
    if (!trial) return;
    trial.assignment_completed_at_utc = isoNow();
    trial.random_source = assignment.random_source;
    trial.randomness = assignment.randomness;
    trial.beacon = assignment.beacon;
    trial.fallback_error = assignment.fallback_error || null;
    trial.safe_side = assignment.safe_side;
    trial.feedback_condition = trial.practice ? "revealed" : assignment.feedback_condition;
    trial.matched_safe_side = trial.choice === trial.safe_side;
    trial.feedback_shown = trial.feedback_condition === "revealed"
      ? (trial.matched_safe_side ? "calm" : "mild_threat")
      : "neutral_mask";
    trial.completed_at_utc = isoNow();

    session.trials.push(structuredCloneSafe(trial));
    session.pending_trial = null;
    pendingTrial = null;
    currentTrial = null;
    setBeaconVisible(false);
    const completedInBlock = trial.practice ? trial.trial_index_all : trial.trial_index_experimental;
    progressBar.style.width = `${(completedInBlock / (trial.practice ? PRACTICE_TRIALS : EXPERIMENT_TRIALS)) * 100}%`;

    if (trial.feedback_shown === "calm") {
      setStageMessage("PATH OPEN", "A quiet clearing receives you.");
      setScene("safe", { choice: trial.choice, safeSide: trial.safe_side, feedback: "calm" });
      playTone("safe");
    } else if (trial.feedback_shown === "mild_threat") {
      setStageMessage("PATH GUARDED", "A serpent crosses the route.");
      setScene("threat", { choice: trial.choice, safeSide: trial.safe_side, feedback: "threat" });
      playTone("threat");
    } else {
      setStageMessage("OUTCOME MASKED", "This path remains behind the fog.");
      setScene("masked", { choice: trial.choice, safeSide: trial.safe_side, feedback: "masked" });
      playTone("masked");
    }

    phase = "feedback";
    stopButton.disabled = false;
    void saveSession();
    schedule(advanceTrial, FEEDBACK_MS);
  }

  function advanceTrial() {
    currentTrialIndex += 1;
    if (currentTrialIndex >= TOTAL_TRIALS) {
      finishSession();
      return;
    }
    if (currentTrialIndex === PRACTICE_TRIALS) {
      setStageMessage("PRACTICE COMPLETE", "The recorded experiment begins now.");
      setScene("transition");
      phase = "transition";
      schedule(beginTrial, 1500);
      return;
    }
    beginTrial();
  }

  function buildSummary() {
    const experimental = session.trials.filter((trial) => !trial.practice);
    const revealed = experimental.filter((trial) => trial.feedback_condition === "revealed");
    return {
      experimental_trials_completed: experimental.length,
      practice_trials_completed: session.trials.filter((trial) => trial.practice).length,
      matches_safe_side: experimental.filter((trial) => trial.matched_safe_side).length,
      left_choices: experimental.filter((trial) => trial.choice === "left").length,
      right_choices: experimental.filter((trial) => trial.choice === "right").length,
      revealed_trials: revealed.length,
      masked_trials: experimental.length - revealed.length,
      drand_trials: experimental.filter((trial) => trial.random_source === "drand_quicknet_future_round").length,
      fallback_trials: experimental.filter((trial) => trial.random_source === "browser_webcrypto_fallback").length,
      mean_choice_rt_ms: experimental.length
        ? Math.round(experimental.reduce((sum, trial) => sum + trial.choice_rt_ms, 0) / experimental.length)
        : null,
      individual_inference_allowed: false
    };
  }

  function finishSession() {
    clearPhaseTimer();
    phase = "complete";
    setResponseVisible(false);
    setBeaconVisible(false);
    setScene("idle");
    session.session.status = "completed";
    session.session.completed_at_utc = isoNow();
    session.summary = buildSummary();
    session.pending_trial = null;
    void saveSession();

    document.querySelector("#result-participant").textContent = session.participant.id;
    document.querySelector("#result-trials").textContent = `${session.summary.experimental_trials_completed}/${EXPERIMENT_TRIALS}`;
    document.querySelector("#result-hits").textContent = `${session.summary.matches_safe_side}/${session.summary.experimental_trials_completed}`;
    document.querySelector("#result-beacons").textContent = `${session.summary.drand_trials}/${session.summary.experimental_trials_completed}`;
    showScreen(resultsScreen);
  }

  async function sha256Hex(text) {
    if (!(window.crypto && window.crypto.subtle)) return null;
    const bytes = new TextEncoder().encode(text);
    const hash = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash), (value) => value.toString(16).padStart(2, "0")).join("");
  }

  async function downloadSession(partial = false) {
    if (!session) return;
    const core = structuredCloneSafe(session);
    core.pending_trial = pendingTrial ? structuredCloneSafe(pendingTrial) : core.pending_trial;
    const canonical = JSON.stringify(core);
    const payload = {
      ...core,
      export: {
        exported_at_utc: isoNow(),
        export_status: partial || session.session.status !== "completed" ? "partial" : "complete",
        core_record_sha256: await sha256Hex(canonical),
        filename_contains_anonymous_id_only: true
      }
    };
    const suffix = payload.export.export_status;
    const filename = `forepath_${session.participant.id}_${suffix}.json`;
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    const state = document.querySelector("#download-state");
    if (state) state.textContent = `Downloaded ${filename}. Keep this file unchanged for analysis.`;
  }

  function stopStudy() {
    if (!session || ["complete", "stopped"].includes(phase)) return;
    clearPhaseTimer();
    runToken += 1;
    session.session.manual_stops += 1;
    session.session.status = "stopped_partial";
    if (currentTrial && !currentTrial.quality_flags.includes("manually_interrupted")) currentTrial.quality_flags.push("manually_interrupted");
    if (pendingTrial && !pendingTrial.quality_flags.includes("manually_interrupted")) pendingTrial.quality_flags.push("manually_interrupted");
    phase = "stopped";
    setResponseVisible(false);
    setBeaconVisible(false);
    setScene("idle");
    void saveSession();
    showScreen(stoppedScreen);
  }

  function resumeStudy() {
    if (!session) return;
    session.session.status = "in_progress";
    showScreen(gameScreen);
    if (pendingTrial && pendingTrial.choice) {
      if (!pendingTrial.quality_flags.includes("assignment_restarted_after_stop")) {
        pendingTrial.quality_flags.push("assignment_restarted_after_stop");
      }
      currentTrial = pendingTrial;
      phase = "response";
      setScene("fork", { choice: null, safeSide: null, feedback: null });
      setStageMessage("RESTARTED PATH", "Please choose again; this trial will be quality-flagged.");
      setResponseVisible(true);
      pendingTrial = null;
      currentTrial.choice = null;
      currentTrial.choice_at_utc = null;
      currentTrial.assignment_request_at_utc = null;
      currentTrial.response_opened_at_utc = isoNow();
      currentTrial.response_opened_perf_ms = Math.round(performance.now());
    } else {
      beginTrial();
    }
  }

  async function deleteAndLeave() {
    await deleteStoredSession();
    session = null;
    pendingTrial = null;
    currentTrial = null;
    window.location.href = "../../#videogames";
  }

  function ensureAudio() {
    if (audioContext) return audioContext;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
    return audioContext;
  }

  function startAmbient() {
    const audio = ensureAudio();
    if (!audio || ambientNodes.length) return;
    const master = audio.createGain();
    master.gain.value = 0.026;
    master.connect(audio.destination);
    const low = audio.createOscillator();
    const high = audio.createOscillator();
    const highGain = audio.createGain();
    low.type = "sine";
    low.frequency.value = 82;
    high.type = "triangle";
    high.frequency.value = 123;
    highGain.gain.value = 0.18;
    low.connect(master);
    high.connect(highGain);
    highGain.connect(master);
    low.start();
    high.start();
    ambientNodes = [low, high, highGain, master];
  }

  function stopAmbient() {
    ambientNodes.slice(0, 2).forEach((node) => {
      try { node.stop(); } catch (_) { /* already stopped */ }
    });
    ambientNodes.forEach((node) => {
      try { node.disconnect(); } catch (_) { /* already disconnected */ }
    });
    ambientNodes = [];
  }

  function playTone(kind) {
    if (!soundOn) return;
    const audio = ensureAudio();
    if (!audio) return;
    if (audio.state === "suspended") void audio.resume();
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const settings = {
      lock: [170, 0.08, "sine"],
      safe: [392, 0.28, "sine"],
      threat: [92, 0.34, "sawtooth"],
      masked: [220, 0.2, "triangle"]
    }[kind] || [220, 0.1, "sine"];
    oscillator.type = settings[2];
    oscillator.frequency.setValueAtTime(settings[0], now);
    if (kind === "safe") oscillator.frequency.exponentialRampToValueAtTime(523, now + settings[1]);
    if (kind === "threat") oscillator.frequency.exponentialRampToValueAtTime(58, now + settings[1]);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === "threat" ? 0.045 : 0.06, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + settings[1]);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + settings[1] + 0.03);
  }

  function toggleSound() {
    soundOn = !soundOn;
    soundToggle.setAttribute("aria-pressed", String(soundOn));
    soundToggle.setAttribute("aria-label", soundOn ? "Turn sound off" : "Turn sound on");
    soundToggle.querySelector(".button-label").textContent = soundOn ? "Sound on" : "Sound off";
    soundToggle.querySelector("span[aria-hidden]").textContent = soundOn ? "●" : "◌";
    if (soundOn) {
      const audio = ensureAudio();
      if (audio && audio.state === "suspended") void audio.resume();
      startAmbient();
    } else {
      stopAmbient();
    }
    if (session) {
      session.session.sound_ever_enabled = session.session.sound_ever_enabled || soundOn;
      void saveSession();
    }
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        const target = document.documentElement;
        if (target.requestFullscreen) await target.requestFullscreen();
        else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
        if (session) session.session.fullscreen_used = true;
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (_) {
      fullscreenToggle.setAttribute("aria-label", "Fullscreen is unavailable in this browser");
    }
  }

  function updateFullscreenButton() {
    const active = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    fullscreenToggle.querySelector(".button-label").textContent = active ? "Exit fullscreen" : "Fullscreen";
    fullscreenToggle.setAttribute("aria-label", active ? "Exit fullscreen" : "Enter fullscreen");
  }

  function drawForest(time) {
    const width = canvas.width;
    const height = canvas.height;
    const horizon = 190;
    const elapsed = (time - scene.phaseStarted) / 1000;
    const moving = scene.phase === "approach";
    const motion = moving ? elapsed * 0.19 : 0;

    const sky = ctx.createLinearGradient(0, 0, 0, horizon + 80);
    sky.addColorStop(0, "#071814");
    sky.addColorStop(0.58, "#17382c");
    sky.addColorStop(1, "#8aa879");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(width * 0.5, horizon * 0.9, 5, width * 0.5, horizon, width * 0.5);
    glow.addColorStop(0, "rgba(232,225,166,.42)");
    glow.addColorStop(0.32, "rgba(145,196,145,.10)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#142c22";
    ctx.fillRect(0, horizon, width, height - horizon);

    drawDistantTrees(width, horizon, time);
    drawPath(width, height, horizon, motion);
    drawTrees(width, height, horizon, motion);
    drawGroundMarks(width, height, horizon, motion);

    if (scene.phase === "safe") drawSafeOutcome(width, height, elapsed);
    if (scene.phase === "threat") drawThreatOutcome(width, height, elapsed);
    if (scene.phase === "masked") drawFog(width, height, elapsed);
    if (scene.phase === "resolving" || scene.phase === "transition") drawParticles(width, height, elapsed);

    const vignette = ctx.createRadialGradient(width / 2, height / 2, height * 0.18, width / 2, height / 2, width * 0.72);
    vignette.addColorStop(0.55, "rgba(0,0,0,0)");
    vignette.addColorStop(1, scene.phase === "threat" ? "rgba(35,2,4,.66)" : "rgba(0,8,5,.62)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  function drawDistantTrees(width, horizon, time) {
    ctx.fillStyle = "#10271e";
    const shift = Math.sin(time / 2600) * 2;
    for (let index = 0; index < 42; index += 1) {
      const x = (index / 41) * width + shift;
      const treeHeight = 30 + ((index * 29) % 46);
      ctx.beginPath();
      ctx.moveTo(x - 15, horizon + 9);
      ctx.lineTo(x, horizon - treeHeight);
      ctx.lineTo(x + 15, horizon + 9);
      ctx.fill();
    }
  }

  function drawPath(width, height, horizon, motion) {
    const forked = ["fork", "resolving", "safe", "threat", "masked"].includes(scene.phase);
    const ground = ctx.createLinearGradient(0, horizon, 0, height);
    ground.addColorStop(0, "#65745a");
    ground.addColorStop(1, "#9d9b70");
    ctx.fillStyle = ground;

    if (!forked) {
      ctx.beginPath();
      ctx.moveTo(width * 0.47, horizon);
      ctx.lineTo(width * 0.53, horizon);
      ctx.lineTo(width * 0.78, height);
      ctx.lineTo(width * 0.22, height);
      ctx.closePath();
      ctx.fill();
    } else {
      const forkY = height * 0.57;
      ctx.beginPath();
      ctx.moveTo(width * 0.47, horizon);
      ctx.lineTo(width * 0.53, horizon);
      ctx.lineTo(width * 0.54, forkY);
      ctx.lineTo(width * 0.82, height);
      ctx.lineTo(width * 0.57, height);
      ctx.lineTo(width * 0.5, forkY + 12);
      ctx.lineTo(width * 0.43, height);
      ctx.lineTo(width * 0.18, height);
      ctx.lineTo(width * 0.46, forkY);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(235,229,180,.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, forkY + 4);
      ctx.lineTo(width * 0.3, height);
      ctx.moveTo(width * 0.5, forkY + 4);
      ctx.lineTo(width * 0.7, height);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(232,224,173,.18)";
    ctx.lineWidth = 2;
    for (let index = 0; index < 8; index += 1) {
      const t = ((index / 8 + motion) % 1);
      const y = horizon + Math.pow(t, 2.2) * (height - horizon);
      const half = 14 + Math.pow(t, 2) * width * 0.22;
      ctx.beginPath();
      ctx.moveTo(width / 2 - half * 0.35, y);
      ctx.lineTo(width / 2 + half * 0.35, y);
      ctx.stroke();
    }
  }

  function drawTrees(width, height, horizon, motion) {
    const sorted = [...treeLayout].sort((a, b) => a.depth - b.depth);
    sorted.forEach((tree, index) => {
      const depth = (tree.depth + motion * 0.24) % 1;
      const perspective = 0.13 + Math.pow(depth, 1.7) * 1.15;
      const x = width / 2 + tree.side * (width * (0.13 + depth * tree.spread));
      const baseY = horizon + Math.pow(depth, 2) * (height - horizon + 70);
      const trunkHeight = 100 * perspective + 22;
      const trunkWidth = 12 * perspective + 3;
      ctx.save();
      ctx.translate(x, baseY);
      ctx.rotate(tree.lean);
      ctx.fillStyle = index % 3 === 0 ? "#142018" : "#19271d";
      ctx.fillRect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight);
      ctx.fillStyle = index % 4 === 0 ? "#173a29" : "#123122";
      ctx.beginPath();
      ctx.moveTo(-44 * perspective, -trunkHeight * 0.72);
      ctx.lineTo(0, -trunkHeight - 92 * perspective);
      ctx.lineTo(44 * perspective, -trunkHeight * 0.72);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-34 * perspective, -trunkHeight * 0.94);
      ctx.lineTo(0, -trunkHeight - 132 * perspective);
      ctx.lineTo(34 * perspective, -trunkHeight * 0.94);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }

  function drawGroundMarks(width, height, horizon, motion) {
    ctx.fillStyle = "rgba(229,221,166,.16)";
    for (let index = 0; index < 22; index += 1) {
      const t = ((index * 0.137 + motion) % 1);
      const y = horizon + Math.pow(t, 2) * (height - horizon);
      const x = width / 2 + Math.sin(index * 19.2) * (25 + t * width * 0.24);
      const size = 1 + t * 3;
      ctx.fillRect(x, y, size * 2.5, size);
    }
  }

  function drawSafeOutcome(width, height, elapsed) {
    const side = scene.choice === "left" ? -1 : 1;
    const centerX = width / 2 + side * width * 0.22;
    const glow = ctx.createRadialGradient(centerX, height * 0.6, 4, centerX, height * 0.6, width * 0.25);
    glow.addColorStop(0, `rgba(238,225,145,${Math.min(0.38, elapsed * 0.2)})`);
    glow.addColorStop(1, "rgba(145,232,178,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    for (let index = 0; index < 28; index += 1) {
      const x = centerX + Math.sin(index * 8.7) * (30 + (index % 7) * 13);
      const y = height * 0.68 + (index % 5) * 28;
      const bob = Math.sin(elapsed * 2 + index) * 2;
      ctx.fillStyle = index % 3 === 0 ? "#f1c978" : "#c9e69c";
      ctx.beginPath();
      ctx.arc(x, y + bob, 2 + (index % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawThreatOutcome(width, height, elapsed) {
    const side = scene.choice === "left" ? -1 : 1;
    const x = width / 2 + side * width * 0.22;
    const rise = Math.min(1, elapsed * 1.7);
    const baseY = height * 0.83;
    ctx.save();
    ctx.translate(x, baseY + (1 - rise) * 100);
    ctx.strokeStyle = "#251512";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-38, 45);
    ctx.bezierCurveTo(30, 36, -26, -10, 17, -45);
    ctx.bezierCurveTo(43, -67, 30, -100, 7, -113);
    ctx.stroke();
    ctx.fillStyle = "#321b16";
    ctx.beginPath();
    ctx.ellipse(7, -120, 27, 19, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f1c978";
    ctx.fillRect(-3, -127, 4, 4);
    ctx.fillRect(16, -128, 4, 4);
    ctx.strokeStyle = "rgba(234,128,111,.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(6, -113);
    ctx.lineTo(8 + Math.sin(elapsed * 12) * 9, -102);
    ctx.stroke();
    ctx.restore();
  }

  function drawFog(width, height, elapsed) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (let index = 0; index < 12; index += 1) {
      const x = ((index * 137 + elapsed * 24) % (width + 220)) - 110;
      const y = height * 0.34 + (index % 5) * 48;
      const radius = 70 + (index % 4) * 25;
      const fog = ctx.createRadialGradient(x, y, 0, x, y, radius);
      fog.addColorStop(0, "rgba(185,208,193,.15)");
      fog.addColorStop(1, "rgba(185,208,193,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    ctx.restore();
  }

  function drawParticles(width, height, elapsed) {
    ctx.fillStyle = "rgba(241,201,120,.55)";
    for (let index = 0; index < 20; index += 1) {
      const x = (index * 83 + Math.sin(elapsed + index) * 30) % width;
      const y = (index * 47 + elapsed * 22) % height;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  function animate(time) {
    drawForest(time);
    animationFrame = requestAnimationFrame(animate);
  }

  participantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!participantForm.checkValidity()) {
      formError.hidden = false;
      participantForm.reportValidity();
      return;
    }
    formError.hidden = true;
    session = createSession(new FormData(participantForm));
    participantIdPreview.textContent = session.participant.id;
    void saveSession();
    showScreen(instructionsScreen);
  });

  document.querySelector("#open-questionnaire").addEventListener("click", () => showScreen(questionnaireScreen));
  document.querySelector("#back-to-intro").addEventListener("click", () => showScreen(introScreen));
  document.querySelector("#start-practice").addEventListener("click", () => {
    if (!session) return;
    session.session.status = "in_progress";
    session.session.experiment_started_at_utc = isoNow();
    currentTrialIndex = 0;
    showScreen(gameScreen);
    beginTrial();
    if (soundOn) startAmbient();
  });

  dangerRating.addEventListener("input", () => {
    dangerOutput.value = dangerRating.value;
    if (phase === "response" && currentTrial) currentTrial.danger_slider_changes += 1;
  });
  confidenceRating.addEventListener("input", () => {
    confidenceOutput.value = confidenceRating.value;
    if (phase === "response" && currentTrial) currentTrial.confidence_slider_changes += 1;
  });
  canvas.addEventListener("pointermove", onPointerObservation, { passive: true });
  responseCard.addEventListener("pointermove", onPointerObservation, { passive: true });
  choiceButtons.forEach((button) => button.addEventListener("click", () => choosePath(button.dataset.choice, "button_or_touch")));

  soundToggle.addEventListener("click", toggleSound);
  fullscreenToggle.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
  stopButton.addEventListener("click", stopStudy);
  document.querySelector("#resume-study").addEventListener("click", resumeStudy);
  document.querySelector("#download-results").addEventListener("click", () => downloadSession(false));
  document.querySelector("#download-partial").addEventListener("click", () => downloadSession(true));
  document.querySelector("#delete-local-data").addEventListener("click", async () => {
    await deleteStoredSession();
    document.querySelector("#download-state").textContent = "The local recovery copy has been deleted from this browser.";
  });
  document.querySelector("#delete-partial").addEventListener("click", deleteAndLeave);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !["idle", "complete", "stopped"].includes(phase)) {
      stopStudy();
      return;
    }
    if (phase !== "response") return;
    const tag = document.activeElement ? document.activeElement.tagName : "";
    const isRange = document.activeElement && document.activeElement.matches("input[type='range']");
    if (isRange || tag === "SELECT") return;
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") {
      event.preventDefault();
      void choosePath("left", "keyboard");
    } else if (key === "arrowright" || key === "d") {
      event.preventDefault();
      void choosePath("right", "keyboard");
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!session || document.visibilityState !== "hidden" || ["idle", "complete", "stopped"].includes(phase)) return;
    session.session.visibility_interruptions += 1;
    if (currentTrial) currentTrial.visibility_interrupted = true;
    if (pendingTrial) pendingTrial.visibility_interrupted = true;
    void saveSession();
  });

  window.addEventListener("pagehide", () => {
    if (session) void saveSession();
  });

  animationFrame = requestAnimationFrame(animate);

  window.FOREPATH_TEST = Object.freeze({
    version: BUILD,
    trialCounts: { practice: PRACTICE_TRIALS, experimental: EXPERIMENT_TRIALS },
    deriveAssignment(randomness) {
      return {
        safe_side: parseInt(randomness.slice(0, 2), 16) % 2 === 0 ? "left" : "right",
        feedback_condition: parseInt(randomness.slice(2, 4), 16) % 2 === 0 ? "revealed" : "masked"
      };
    },
    getPhase: () => phase,
    getSession: () => (session ? structuredCloneSafe(session) : null)
  });
})();
