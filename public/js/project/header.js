// let pro_deadline = ``;

// function deadlineCalc() {
//     const projectStartDate = document.querySelector("#projectStartDate").value;
//     const projectEndDate = document.querySelector("#projectEndDate").value;

//     console.log(projectStartDate);

//     // if (projectStartDate == !null && projectEndDate == !null) {
//     //     `${diff(projectStartDate, "days")}`;

//     //     document.querySelector(".pro_deadline").innerHTML = pro_deadline;
//     // }
// }

// projectStartDate.setAttribute("dateType2", "YYYY-MM-dd");

// const projectStartDate = document.querySelector("#projectStartDate").value;

// 서버에서 가져와서 시행하는 것은 즉시실행 함수?
// 함수에서 굳이 직접 넣어 실행할 필요 없음

// 프로젝트 생성 시 날짜 불러오기

const token = localStorage.getItem("token");

(async function () {
    const getProjectInfoResult = await axios({
        method: "post",
        url: "/api/project/get/info",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // console.log("getProjectDate.data", getProjectInfoResult.data);
    const { success, result } = getProjectInfoResult.data;
    // console.log(typeof result.start_date);
    let stringStartDate = new Date(result.start_date);
    let startYear = stringStartDate.getFullYear();
    let startMonth = stringStartDate.getMonth() + 1;
    let startDate = stringStartDate.getDate();

    let formattedStartDate = `${startYear}-${startMonth.toString().padStart(2, "0")}-${startDate
        .toString()
        .padStart(2, "0")}`;

    let stringEndDate = new Date(result.end_date);
    let endYear = stringEndDate.getFullYear();
    let endMonth = stringEndDate.getMonth() + 1;
    let endDate = stringEndDate.getDate();

    let formattedEndDate = `${endYear}-${endMonth.toString().padStart(2, "0")}-${endDate.toString().padStart(2, "0")}`;

    document.querySelector("#startDate").value = formattedStartDate;
    document.querySelector("#endDate").value = formattedEndDate;
    // document.querySelector("#projectEndDate").textContent = `${result.end_date}`;
    document.querySelector(".github_link").href = result.github;
    document.querySelector(".pro_name").textContent = result.project_name;
    // planning progress needFeedback finishFeedback suspend finish

    console.log("작업상태 변경", result.status);
    const circle = document.querySelector("#blue");
    const status = document.getElementById("pro_status");
    const bg = document.getElementById("bg");
    if (result.status === "progress") {
        status.textContent = "진행중";
        bg.style.backgroundColor = "#f9f9c1";
        circle.style.backgroundColor = "#eaea5e";
    } else if (result.status === "planning") {
        status.textContent = "계획중";
        bg.style.backgroundColor = "hsl(199, 74%, 85%)";
        circle.style.backgroundColor = "hsl(198, 60%, 70%)";
    } else if (result.status === "needFeedback") {
        status.textContent = "피드백 요청";
        bg.style.backgroundColor = "#f8cfcf";
        circle.style.backgroundColor = "#f25c5c";
    } else if (result.status === "finishFeedback") {
        status.textContent = "피드백 완료";
        bg.style.backgroundColor = "#d1d0d0";
        circle.style.backgroundColor = "#504e4e";
    } else if (result.status === "suspend") {
        status.textContent = "중단";
        bg.style.backgroundColor = "#f8d6f8";
        circle.style.backgroundColor = "purple";
    } else if (result.status === "finish") {
        status.textContent = "완료";
        bg.style.backgroundColor = "#d2f5d2";
        circle.style.backgroundColor = "#328d32";
    } else {
        console.log("일치하는 상태가 없습니다.");
    }

    const getDateDiff = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);

        const diffDate = date1.getTime() - date2.getTime();

        return Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
    };

    let deadlineCalc = getDateDiff(`${formattedStartDate}`, `${formattedEndDate}`);
    document.querySelector(".pro_deadline").textContent = `D-${deadlineCalc}`;
})();

// 날짜 변경 값을 서버에 보내주기
async function dateEdit() {
    const changedStartDate = document.querySelector("#startDate").value;
    const changeEndDate = document.querySelector("#endDate").value;

    const res = await axios({
        method: "patch",
        url: "/api/project/update/period",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            start_date: changedStartDate,
            end_date: changeEndDate,
        },
    });
    if (res.data.success) {
        alert("날짜가 변경되었습니다.");
        location.reload();
    }
}

// 날짜 수정하고 그대로 계산, 그 값을 계속 유지하게 하는 함수
// 시작일, 마감일 수정할 수 있게 하는 버튼

// 깃허브 링크 추가하는 기능 추가
function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    console.log("close");
}

// 변경한 깃허브 링크 서버로 전송,저장
async function githubSend() {
    const github = document.querySelector("#githubLinkInput").value;
    const token = localStorage.getItem("token");

    try {
        const githubLinkResult = await axios({
            method: "patch",
            url: "/api/project/update/github",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                github,
            },
        });
        console.log(githubLinkResult.data);
        const { result, success } = githubLinkResult.data;

        if (success) {
            document.querySelector(".github_link").href = github;
            alert(`주소가 입력되었습니다.`);
        } else {
            alert("다시 시도해주세요.");
            console.error(`github link 전송 도중 오류가 발생하였습니다. :`, error);
        }
    } catch (error) {
        console.error("오류가 발생하였습니다. :", error);
    }
}

// 로딩될 때 값 불러오기

//프로젝트 명 수정하기
const fiexdPJNameDiv = document.getElementById("pro_name");
fiexdPJNameDiv.addEventListener("keydown", function (event) {
    // Enter 키의 keyCode는 13입니다.
    if (event.keyCode === 13) {
        event.preventDefault();
        const fiexdPJName = document.getElementById("pro_name").innerHTML;
        console.log(fiexdPJName);
        axios({
            method: "patch",
            url: "/api/project/update/name",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: { project_name: fiexdPJName },
        }).then((res) => {
            console.log("res", res.data);
            if (res.data.success) {
                alert("프로젝트 이름이 변경되었습니다.");
                location.reload();
            }
        });
    }
});

// select_box
/* 화살표 함수 */
const label = document.querySelector("#bg");
const options = document.querySelectorAll(".optionItem");

// 클릭한 옵션의 텍스트를 라벨 안에 넣음
const handleSelect = (item) => {
    label.parentNode.classList.remove("active");
    label.innerHTML = item.textContent;
};
// 옵션 클릭시 클릭한 옵션을 넘김
options.forEach((option) => {
    option.addEventListener("click", () => handleSelect(option));
});

// 라벨을 클릭시 옵션 목록이 열림/닫힘
label.addEventListener("click", () => {
    if (label.parentNode.classList.contains("active")) {
        label.parentNode.classList.remove("active");
    } else {
        label.parentNode.classList.add("active");
    }
});

// 상태 변경후 변경된 상태를 서버로 전송, 저장
async function changeStatusToPlan() {
    //작업상태 : planning progress needFeedback finishFeedback suspend finish
    const status = "planning";
    try {
        const res = await axios({
            method: "patch",
            url: "/api/project/update/status",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                status,
            },
        });
        if (res.data.success) {
            alert(`상태가 변경되었습니다.`);
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}
async function changeStatusToProg() {
    //작업상태 : planning progress needFeedback finishFeedback suspend finish
    const status = "progress";
    try {
        const res = await axios({
            method: "patch",
            url: "/api/project/update/status",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                status,
            },
        });
        if (res.data.success) {
            alert(`상태가 변경되었습니다.`);
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}
async function changeStatusToSus() {
    //작업상태 : planning progress needFeedback finishFeedback suspend finish
    const status = "suspend";
    try {
        const res = await axios({
            method: "patch",
            url: "/api/project/update/status",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                status,
            },
        });
        if (res.data.success) {
            alert(`상태가 변경되었습니다.`);
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}
async function changeStatusToFin() {
    //작업상태 : planning progress needFeedback finishFeedback suspend finish
    const status = "finish";
    try {
        const res = await axios({
            method: "patch",
            url: "/api/project/update/status",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                status,
            },
        });
        if (res.data.success) {
            alert(`상태가 변경되었습니다.`);
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}
async function changeStatusToNeedFeed() {
    //작업상태 : planning progress needFeedback finishFeedback suspend finish
    const status = "needFeedback";
    try {
        const res = await axios({
            method: "patch",
            url: "/api/project/update/status",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                status,
            },
        });
        if (res.data.success) {
            alert(`상태가 변경되었습니다.`);
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}
async function changeStatusToFinishFeed() {
    //작업상태 : planning progress needFeedback finishFeedback suspend finish
    const status = "finishFeedback";
    try {
        const res = await axios({
            method: "patch",
            url: "/api/project/update/status",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                status,
            },
        });
        if (res.data.success) {
            alert(`상태가 변경되었습니다.`);
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}

const nowLocated = window.location.pathname;
const nowLocatedPath = window.location.pathname.substring(9, nowLocated.length);
console.log(nowLocatedPath);

if (nowLocatedPath === "home") {
    const boldLink = document.getElementById("home");
    boldLink.style.fontWeight = "700";
}
if (nowLocatedPath === "board_main") {
    const boldLink = document.getElementById("board_main");
    boldLink.style.fontWeight = "700";
}
if (nowLocatedPath === "calender") {
    const boldLink = document.getElementById("calender");
    boldLink.style.fontWeight = "700";
}
if (nowLocatedPath === "issue_main") {
    const boldLink = document.getElementById("issue_main");
    boldLink.style.fontWeight = "700";
}
