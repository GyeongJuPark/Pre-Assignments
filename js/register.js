$(document).ready(function () {
    getSports();
});

// 이미지 크기 검사
const fileInput = document.getElementById("input-image");
const selectedImage = document.getElementById("img");
const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
let base64ImageData = null;

fileInput.addEventListener("change", (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
        const [imageFile] = selectedFiles;

        if (imageFile.size > maxSizeInBytes) {
            alert("이미지 크기는 4MB 이하이어야 합니다.");
            fileInput.value = "";
            return;
        }
        const fileReader = new FileReader();

        fileReader.onload = () => {
            const srcData = fileReader.result;
            selectedImage.src = srcData;

            base64ImageData = srcData.split(",")[1];
        };
        fileReader.readAsDataURL(imageFile);
    }
});

// 식별코드검색, 학교명검색 모달 창
function openSearchModal(searchType) {
    var modal = $('#largeModal');
    modal.find('.modal-title').text((searchType === 'leaderList' ? '지도자 ' : '학교 ') + '식별코드검색');

    btnGetModalData(searchType);

    var searchContent = '';
    if (searchType === 'leaderList') {
        searchContent = `
        <label for="searchLeaderModalInput">성명</label>
        <input type="text" id="searchLeaderModalInput" placeholder="이름을 입력하세요">
        <button class="search_btn" onclick="searchLeaderList()">검색하기</button>
        <div id="table-container">
        <table class="t">
            <thead>
                <tr onclick="selectRow(this)">
                    <th>번호</th>
                    <th>식별코드</th>
                    <th>이름</th>
                </tr>
            </thead>
            <tbody id="leaderTableBody"></tbody>
        </table>
    </div>
    <div class="buttons-container">
        <button class="cancel_btn" onclick="cancelSchoolRegistration()">취소하기</button>
        <button class="add_btn" onclick="noSelectedLeader()">등록하기</button>
    </div>
    `;
    } else if (searchType === 'schoolList') {
        searchContent = `
    <label for="searchSchoolModalInput">학교명</label>
    <input type="text" id="searchSchoolModalInput" placeholder="학교명을 입력하세요">
    <button class="search_btn" onclick="searchSchoolList()">검색하기</button>
    <div id="table-container">
    <table class="t">
        <thead>
            <tr onclick="selectRow(this)">
                <th>번호</th>
                <th>학교명</th>
            </tr>
        </thead>
        <tbody id="schoolTableBody"></tbody>
    </table>
    </div>
    <div class="buttons-container">
    <button class="cancel_btn" onclick="cancelSchoolRegistration()">취소하기</button>
    <button class="add_btn" onclick="noSelectedSchool()">등록하기</button>
    </div>
    `;
    }
    modal.find('#searchContent').html(searchContent);
    modal.modal('show');
}

function btnGetModalData(searchType) {
    var url = '';
    if (searchType === 'leaderList') {
        url = 'https://jbeteacherstytem-dev.azurewebsites.net/api/leaders';
    } else if (searchType === 'schoolList') {
        url = 'https://jbeteacherstytem-dev.azurewebsites.net/api/schools';
    }

    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            updateTable(data, searchType);
        },
        error: function (error) {
            console.error(error);
        }
    });
}

function searchLeaderList() {
    var searchModalInput = $('#searchLeaderModalInput').val();
    var tableRows = $('#leaderTableBody').find('tr');

    tableRows.each(function () {
        var cells = $(this).find('td');
        var name = cells.eq(2).text();

        if (name.includes(searchModalInput)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function searchSchoolList() {
    var searchModalInput = $('#searchSchoolModalInput').val();
    var tableRows = $('#schoolTableBody').find('tr');

    tableRows.each(function () {
        var cells = $(this).find('td');
        var name = cells.eq(1).text();

        if (name.includes(searchModalInput)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function updateTable(data, searchType) {
    var tableBody = $('#' + (searchType === 'leaderList' ? 'leaderTableBody' : 'schoolTableBody'));

    tableBody.empty();

    data.forEach(function (row, index) {
        var newRow = '<tr onclick="selectRow(this)"><td>' + (index + 1) + '</td>';

        if (searchType === 'leaderList') {
            newRow += '<td>' + row.leaderNO + '</td>';
            newRow += '<td>' + row.leaderName + '</td>';
        } else if (searchType === 'schoolList') {
            newRow += '<td>' + row.schoolName + '</td>';
            newRow += '<td style="display:none">' + row.schoolNo + '</td>';
        }

        newRow += '</tr>';
        tableBody.append(newRow);
    });
}

function cancelSchoolRegistration() {
    var modal = $('#largeModal');
    modal.modal('hide');
}

function noSelectedLeader() {
    var selectedRows = $('.selected-row');
    var leaderCode = $('#leaderNo');
    var leaderName = $('#leaderName');

    if (selectedRows.length > 0) {
        var cells = selectedRows.find('td');
        leaderCode.val(cells.eq(1).text());
        leaderName.val(cells.eq(2).text());
        cancelSchoolRegistration();
    } else {
        openShortModal('선택된 식별코드 없음', '선택된 지도자 식별코드가 없습니다. 지도자 식별코드를 선택해주시기 바랍니다.');
    }
}

function noSelectedSchool() {
    var selectedRows = $('.selected-row');
    var schoolName = $('#schoolName');
    var schoolCode = $('#schoolNo');
    var historySchoolName = $('#historySchoolName');


    if (selectedRows.length > 0) {
        var cells = selectedRows.find('td');
        schoolName.val(cells.eq(1).text());
        historySchoolName.val(cells.eq(1).text());
        schoolCode.val(cells.eq(2).text());
        cancelSchoolRegistration();
    } else {
        openShortModal('선택된 학교 없음', '선택된 학교명이 없습니다. 학교명을 선택해주시기 바랍니다.');
    }
}

function cancelSchoolRegistration() {
    var modal = $('#largeModal');
    modal.modal('hide');
}

function noSelectedLeader() {
    var selectedRows = $('.selected-row');
    var leaderCode = $('#leaderNo');
    var leaderName = $('#leaderName');

    if (selectedRows.length > 0) {
        var cells = selectedRows.find('td');
        leaderCode.val(cells.eq(1).text());
        leaderName.val(cells.eq(2).text());
        cancelSchoolRegistration();
    } else {
        openShortModal('선택된 식별코드 없음', '선택된 지도자 식별코드가 없습니다. 지도자 식별코드를 선택해주시기 바랍니다.');
    }
}

function noSelectedSchool() {
    var selectedRows = $('.selected-row');
    var schoolName = $('#schoolName');
    var schoolCode = $('#schoolNo');
    var historySchoolName = $('#historySchoolName');


    if (selectedRows.length > 0) {
        var cells = selectedRows.find('td');
        schoolName.val(cells.eq(1).text());
        historySchoolName.val(cells.eq(1).text());
        schoolCode.val(cells.eq(2).text());
        cancelSchoolRegistration();
    } else {
        openShortModal('선택된 학교 없음', '선택된 학교명이 없습니다. 학교명을 선택해주시기 바랍니다.');
    }
}

// 종목 추가
function getSports() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "https://jbeteacherstytem-dev.azurewebsites.net/api/sports",
        dataType: "json",
        success: function (res) {
            addOptions($('[name=sportsNo]'), res);
        }
    });
}

// select 요소 추가
function addOptions(select, options) {
    $.each(options, function (index, value) {
        select.append($('<option>', {
            value: value.sportsNo,
            text: value.sportsName
        }));
    });
}

// 근무 이력 테이블 추가
function addWorking() {
    var schoolName = $("#historySchoolName").val();
    var startDT = $("#historyStartDT").val();
    var endDT = $("#historyEndDT").val();
    var sportsNo = $("#historySportsNo").val();

    var row = '<tr>';
    row += '<td><input type="text" name="schoolName" value="' + schoolName + '" /></td>';
    row += '<td><input type="date" name="startDT" value="' + startDT + '" ></td>';
    row += '<td><input type="date" name="endDT" value="' + endDT + '" ></td>';
    row += '<td><select name="sportsNo"><option value="' + sportsNo + '">' + $("#historySportsNo option:selected").text() + '</option></select></td>';
    row += '<td><input type="button" class="btn btn-sm minus-btn" value="삭제" onclick="Item_Remove(this)"/></td></tr>';

    $("#history_table tbody").append(row);

    $("#historySchoolName").val('');
    $("#historyStartDT").val('');
    $("#historyEndDT").val('');
    $("#historySportsNo").val('');
}

// 자격사항 테이블 추가
function addCertificate() {
    var certificateName = $("#certificateName").val();
    var certificateNumber = $("#certificateNumber").val();
    var certificateDT = $("#certificateDT").val();
    var organization = $("#organization").val();

    var row = '<tr>';
    row += '<td><input type="text" name="CertificateName" value="' + certificateName + '" ></td>';
    row += '<td><input type="text" name="CertificateNumber" value="' + certificateNumber + '" ></td>';
    row += '<td><input type="date" name="CertificateDT" value="' + certificateDT + '" ></td>';
    row += '<td><input type="test" name="organization" value="' + organization + '" readonly></td>';
    row += '<td><input type="button" value="삭제" onclick="Item_Remove(this)"/></td></tr>';

    $("#certificateName").val('');
    $("#certificateNumber").val('');
    $("#certificateDT").val('');
    $("#organization").val('');

    $("#certificate_table").append(row);
};