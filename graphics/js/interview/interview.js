document.addEventListener('DOMContentLoaded', () => {
    const speedcontrolBundle = 'nodecg-speedcontrol';
    let runDataActiveRun = NodeCG.Replicant('runDataActiveRun', speedcontrolBundle);
    let runDataArray = NodeCG.Replicant('runDataArray', speedcontrolBundle);

    NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(loadRunData);

    // Get the next X runs in the schedule.
    function getNextRuns(runData, amount) {
        let nextRuns = [];
        let indexOfCurrentRun = findIndexInRunDataArray(runData);
        for (let i = 1; i <= amount; i++) {
            if (!runDataArray.value[indexOfCurrentRun + i]) {
                break;
            }
            nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
        }
        return nextRuns;
    }

    // Find array index of current run based on it's ID.
    function findIndexInRunDataArray(run) {
        let indexOfRun = -1;

        // Completely skips this if the run variable isn't defined.
        if (run) {
            for (let i = 0; i < runDataArray.value.length; i++) {
                if (run.id === runDataArray.value[i].id) {
                    indexOfRun = i; break;
                }
            }
        }

        return indexOfRun;
    }

    function loadRunData() {
        runDataActiveRun.on('change', (newVal, oldVal) => {
            refreshNextRunsData(newVal);
            if (newVal) {
                updateSceneFields(newVal);
            }
        });

        runDataArray.on('change', (newVal, oldVal) => {
            refreshNextRunsData(runDataActiveRun.value);
        });
    }

    function refreshNextRunsData(currentRun) {
        const numUpcoming = 4;
        let nextRuns = getNextRuns(currentRun, numUpcoming);

        if (nextRuns.length < numUpcoming) {
            hideDeckElements(numUpcoming, nextRuns.length);
        }

        // Next up game.
        if (nextRuns.length > 0) {
            let comingUpGame = $('.coming-up-name');
            let comingUpCategory = $(".coming-up-category");
            let comingUpInfo = $("#coming-up-info");
            comingUpGame.empty();
            comingUpGame.html(nextRuns[0].game);
            comingUpCategory.empty();
            comingUpCategory.html(nextRuns[0].category);
            comingUpInfo.css("opacity", 1);

            if (nextRuns.length > 1) {
                $("#on-deck-info-wrapper").css("opacity", 1);
            }

            // On deck games.
            for (let i = 1; i < nextRuns.length; i++) {
                let run = nextRuns[i];
                let onDeckGame = $(".on-deck-name" + i);
                let onDeckCategory = $(".on-deck-category" + i);
                let onDeckInfo = $("#on-deck-info"+i);
                onDeckGame.empty();
                onDeckGame.html(run.game);
                onDeckCategory.empty();
                onDeckCategory.html(run.category);
                onDeckInfo.css("opacity", 1);
            }
        }
    }

    function hideDeckElements(numUpcoming, numOnDeck) {
        if (numOnDeck >= 2) {
            for (let i = 1; i < (numUpcoming-numOnDeck)+1; i++) {
                let onDeckElement = document.getElementById("on-deck-info" + (numUpcoming-i));
                onDeckElement.style.opacity = "0";
            }
        }

        if (numOnDeck <= 1) {
            let onDeckElement = document.getElementById("on-deck-info-wrapper" );
            onDeckElement.style.opacity = "0";
        }

        if (numOnDeck === 0) {
            let comingUpElement = document.getElementById("coming-up-info" );
            comingUpElement.style.opacity = "0";
        }
    }

    // Sets information on the pages for the run.
    function updateSceneFields(runData) {

        let currentTeamsData = getRunnersFromRunData(runData);
        // Set each player names and pronouns.
        let i = 1;
        for (let team of currentTeamsData) {
            for (let player of team.players) {
                let name = document.getElementById("runner-name" + i);
                let pronouns = document.getElementById("pronouns" + i);
                name.style.opacity = "0";
                pronouns.style.opacity = "0";

                if (name === null) {
                    name.textContent = "";
                    pronouns.textContent = "";
                    break;
                }

                setTimeout(() => {
                        name.textContent = player.name;
                        pronouns.textContent = player.pronouns;
                        name.style.opacity = "1";
                        pronouns.style.opacity = "1";
                    }, 1000);
                i++;
            }
        }

        if (i <= 2) {
            for (let j = 2; j >= i; j--) {
                let name = document.getElementById("runner-name" + j);
                let pronouns = document.getElementById("pronouns" + j);
                name.style.opacity = "0";
                pronouns.style.opacity = "0";
                setTimeout(() => {
                    name.textContent = "";
                    pronouns.textContent = "";
                    name.style.opacity = "1";
                    pronouns.style.opacity = "1";
                }, 1000);
            }
        }
    }

    // Get team info from run data.
    function getRunnersFromRunData(runData) {
        let currentTeamsData = [];
        runData.teams.forEach(team => {
            let teamData = {players: []};
            team.players.forEach(player => {teamData.players.push(createPlayerData(player));});
            currentTeamsData.push(teamData);
        });
        return currentTeamsData;
    }
});