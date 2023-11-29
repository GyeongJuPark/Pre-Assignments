$(document).ready(function () {
    allLeaderList();
});

function loadLeaderRegister() {
    $.ajax({
        type: "GET",
        url: "./layouts/leaderRegister.html",
        dataType: "text",
        error: function () {
            console.warn("페이지 로딩 에러")
        },
        success: function (data) {
            $('.leader_management').html(data).css('height', '1660');
        }
    });
}

// 선택한 지도자 행 삭제
function btnDeleteSelectedLeaders() {
    var selectedRows = $(".rowCheckbox:checked").closest("tr");

    if (selectedRows.length > 0) {
        var leaderNos = selectedRows.map(function () {
            return { "leaderNo": $(this).find("td:nth-child(3)").text() };
        }).get();

        $.ajax({
            type: "DELETE",
            url: "https://jbeteacherstytem-dev.azurewebsites.net/api/leaders",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(leaderNos),
            success: function () {
                selectedRows.remove();
                btnToggleDelete();
                allLeaderList();
                updatePaginationButtons();
                goToFirstPage()
            },
            error: function () {
                alert('삭제 중 오류가 발생했습니다.');
            }
        });
    }
}

// 지도자 전체 목록
function allLeaderList() {
    $.ajax({
        type: "GET",
        url: "https://jbeteacherstytem-dev.azurewebsites.net/api/leaders/list",
        dataType: "json",
        data: {
            page: currentPage,
            perPage: itemsPerPage
        },
        success: function (data) {
            totalPages = calculateTotalPages(data.length, itemsPerPage);
            updatePaginationButtons();

            $("#leaderListTableBody").empty();

            var startIndex = (currentPage - 1) * itemsPerPage;
            var endIndex = startIndex + itemsPerPage;

            if (data.length > 0) {
                for (var i = startIndex; i < endIndex && i < data.length; i++) {
                    var item = data[i];

                    $("#leaderListTable").append(
                        "<tr>" +
                        "<td><input type='checkbox' class='rowCheckbox' onchange='btnToggleDelete()'></td>" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + item.leaderNo + "</td>" +
                        "<td>" + item.leaderName + "</td>" +
                        "<td>" + item.sportName + "</td>" +
                        "<td>" + item.schoolName + "</td>" +
                        "<td><input type='button' onclick='btnLeaderDetail(this)' value = '상세보기' /></td > " +
                        "</tr>"
                    );
                }
            } else {
                $("#leaderListTableBody").append(
                    "<tr><td colspan='7'>등록된 지도자가 없습니다. 지도자를 등록해주세요.</td></tr>"
                );
            }

            $(".all_leaderList p sub").text("총 " + data.length + "명");
        },
        error: function () {
            alert('데이터를 불러오는데 실패했습니다.');
        }
    });
}

// [ 지도자 관리 ] - 상세보기
function btnLeaderDetail(element) {
    var leaderNo = $(element).closest("tr").find("td:nth-child(3)").text();

    $.ajax({
        type: "GET",
        url: "../layouts/leaderDeatail.html",
        data: { leaderNo: leaderNo },
        dataType: "html",
        success: function (data) {
            $(".leader_management").html(data).css('height', '1660');
            fetchLeaderDetails(leaderNo);
        },
        error: function () {
            alert('페이지 로드에 실패했습니다.');
        }
    });
}

// [ 지도자 상세정보 ] 데이터 불러오기
function fetchLeaderDetails(leaderNo) {
    $.ajax({
        type: "GET",
        url: "https://jbeteacherstytem-dev.azurewebsites.net/api/leaders/" + leaderNo,
        data: { leaderNo: leaderNo },
        dataType: "json",
        success: function (data) {
            getLeaderInfoData(data);
        },
        error: function () {
            console.warn('데이터를 불러오는데 실패했습니다.');
        }
    });
}

// [ 지도자 상세정보 ] 지도자 데이터 가져와서 항목에 맞게 삽입
function getLeaderInfoData(data) {
    $("#leaderNo").text(data.leaderNo);
    $("#schoolName").text(data.history[0].schoolName);
    $("#leaderName").text(data.leaderName);
    $("#birthday").text(data.birthday);
    $("#gender").text(data.gender);
    $("#sports").text(data.sports);
    $("#telNo").text(data.telNo);
    $("#empDT").text(data.empDT);

    if (data.history) {
        updateWorkHistory(data.history);
    } else {
        console.warn("근무 이력 데이터가 없습니다.");
    }
    if (data.certificate) {
        updateCertificates(data.certificate);
    } else {
        console.warn("자격사항 데이터가 없습니다.");
    }
    if (data.leaderImg) {
        $("#leaderImage").attr("src", "data:image/png;base64," + data.leaderImg);
    } else {
        console.warn("이미지 데이터가 없습니다.");
    }
}

// [ 지도자 상세정보 ] 근무이력 
function updateWorkHistory(workHistory) {
    var historyInfoTable = $("#historyInfoTableBody");
    historyInfoTable.empty();

    if (workHistory && workHistory.length > 0) {
        for (var i = 0; i < workHistory.length; i++) {
            var history = workHistory[i];
            historyInfoTable.append(
                "<tr>" +
                "<td>" + history.schoolName + "</td>" +
                "<td>" + history.startDT + "</td>" +
                "<td>" + history.endDT + "</td>" +
                "<td>" + history.sportName + "</td>" +
                "</tr>"
            );
        }
    } else {
        console.warn("근무 이력 데이터가 없습니다.");
    }
}

// [ 지도자 상세정보 ] 자격사항 
function updateCertificates(certificates) {
    var certificateInfoTable = $("#certificateInfoTableBody");
    certificateInfoTable.empty();

    if (certificates && certificates.length > 0) {
        for (var i = 0; i < certificates.length; i++) {
            var certificate = certificates[i];
            certificateInfoTable.append(
                "<tr>" +
                "<td>" + certificate.certificateName + "</td>" +
                "<td>" + certificate.certificateNumber + "</td>" +
                "<td>" + certificate.certificateDT + "</td>" +
                "<td>" + certificate.organization + "</td>" +
                "</tr>"
            );
        }
    } else {
        console.warn("자격사항 데이터가 없습니다.");
    }
}

// [ 지도자 관리 ] - 검색기능
function searchInput() {
    var searchInput = $("#searchInput").val();
    var searchType = $(".btn-select").text();

    $("#leaderListTableBody tr").hide();

    if (searchInput === "") {
        $("#leaderListTableBody tr").show();
    } else {
        if (searchType === "전체") {
            searchMatchResult("#leaderListTableBody tr", searchInput);
        } else if (searchType === "이름") {
            searchMatchResult("#leaderListTableBody tr td:nth-child(4)", searchInput);
        } else if (searchType === "종목") {
            searchMatchResult("#leaderListTableBody tr td:nth-child(5)", searchInput);
        }
    }
}

function searchMatchResult(selector, searchInput) {
    $(selector).filter(function () {
        return $(this).text().includes(searchInput);
    }).closest('tr').show();
}

function toggleAllCheckboxes() {
    $(".rowCheckbox").prop("checked", $("#selectAll").prop("checked"));
    btnToggleDelete();
}

function btnToggleDelete() {
    var selectedRowCount = $(".rowCheckbox:checked").length;
    var btnDeleteLeader = $(".btnDeleteLeader");

    if (selectedRowCount > 0) {
        btnDeleteLeader.addClass("active").prop("disabled", false);
    } else {
        btnDeleteLeader.removeClass("active").prop("disabled", true);
    }
}

// 커스텀 Select
function setupDropdownMenu() {
    const btn = document.querySelector('.btn-select');
    const list = document.querySelector('.list-member');

    btn.addEventListener('click', () => {
        btn.classList.toggle('on');
    });

    list.addEventListener('click', (event) => {
        if (event.target.nodeName === "BUTTON") {
            btn.innerText = event.target.innerText;
            btn.classList.remove('on');
        }
    });
}
// 페이지네이션
var currentPage = 1;
var itemsPerPage = 10;
var totalPages;

function calculateTotalPages(totalItems, itemsPerPage) {
    return Math.ceil(totalItems / itemsPerPage);
}

function goToFirstPage() {
    if (currentPage !== 1) {
        currentPage = 1;
        allLeaderList();
    }
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        allLeaderList();
    }
}

function goToPage(pageNumber) {
    currentPage = pageNumber;
    allLeaderList();
}

function goToNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        allLeaderList();
    }
}

function goToLastPage() {
    if (currentPage !== totalPages) {
        currentPage = totalPages;
        allLeaderList();
    }
}