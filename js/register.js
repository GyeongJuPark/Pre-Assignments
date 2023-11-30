$(document).ready(function () {
    getSports();
});

// 이미지 크기 검사
const fileInput = document.getElementById("input-image");
const selectedImage = document.getElementById("img");
const maxSizeInBytes = 4 * 1024 * 1024;
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

function cancel_addLeader() {
    var modal = $('#shortModal');
    modal.find('.modal-body h2').text('지도자 등록 취소');
    modal.find('.modal-body p').html('지도자 등록을 취소하시겠습니까?<br>작성한 내용은 모두 삭제됩니다.');

    var buttons = '<input class="btn btn-secondary" type="button" value="취소" onclick="closeShortModal()" style="margin-right: 8px;">';
    buttons += '<a href="../index.html"><input class="btn btn-primary" type="button" value="확인"></a>';
    modal.find('.modal-body .modal-buttons').html(buttons);

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

function selectRow(row) {
    var selectedRows = $('.selected-row');
    var clickedRow = $(row);

    if (clickedRow.hasClass('selected-row')) {
        clickedRow.removeClass('selected-row');
    } else {
        selectedRows.removeClass('selected-row');
        clickedRow.addClass('selected-row');
    }
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

function openShortModal(title, message) {
    var modal = $('#shortModal');
    modal.find('.modal-body h2').text(title);
    modal.find('.modal-body p').html(message);
    modal.modal('show');
}

function closeShortModal() {
    $('#shortModal').modal('hide');
}

function Item_Remove(obj) {
    $(obj).closest('tr').remove();
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
        openShortModal('선택된 식별코드 없음', '선택된 지도자 식별코드가 없습니다.<br>지도자 식별코드를 선택해주시기 바랍니다.');
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
        openShortModal('선택된 학교 없음', '선택된 학교명이 없습니다.<br>학교명을 선택해주시기 바랍니다.');
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

// 등록하기 - POST
function addLeaderData() {
    if (validation()) {
        validAfterModal();
    } else {
        openShortModal('필수입력값 확인', '필수입력값이 채워지지 않았습니다.<br>확인 후 채워주시기 바랍니다.');
    }
}

function validAfterModal() {
    var modal = $('#shortModal');
    modal.find('.modal-body h2').text('지도자 등록');
    modal.find('.modal-body p').text('입력한 내용으로 지도자를 등록하시겠습니까?');

    var buttons = '<input class="btn btn-secondary" type="button" value="취소" onclick="closeShortModal()" style="margin-right: 8px;">';
    buttons += '<input class="btn btn-primary" type="button" onclick="postLeaderData()" value="확인">';
    modal.find('.modal-body .modal-buttons').html(buttons);

    modal.modal('show');
}

function postLeaderData() {
    var jsonData = {
        "leaderNo": $("#leaderNo").val(),
        "leaderImage": base64ImageData,
        "leaderName": $("#leaderName").val(),
        "birthday": new Date($("#birthday").val()).toISOString(),
        "gender": $("input[name='gender']:checked").val(),
        "sportsNo": $("#sportsNo").val(),
        "schoolNo": $("#schoolNo").val(),
        "telNo": $("#telNo1").val() + "-" + $("#telNo2").val() + "-" + $("#telNo3").val(),
        "empDT": new Date($("#empDT").val()).toISOString(),
        "history": [
            {
                "startDT": new Date($("#historyStartDT").val()).toISOString(),
                "endDT": new Date($("#historyEndDT").val()).toISOString(),
                "schoolName": $("#historySchoolName").val(),
                "sportsNo": $("#historySportsNo").val()
            }
        ],
        "certificate": [
            {
                "certificateName": $("#certificateName").val(),
                "certificateNumber": $("#certificateNumber").val(),
                "certificateDT": new Date($("#certificateDT").val()).toISOString(),
                "organization": $("#organization").val()
            }
        ]
    };

    console.log(JSON.stringify(jsonData));

    $.ajax({
        url: 'https://jbeteacherstytem-dev.azurewebsites.net/api/leaders',
        type: 'POST',
        data: JSON.stringify(jsonData),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function (response) {
            console.log(response);
            window.location.href = '../index.html'
            allLeaderList();
        },
        error: function (error) {
            console.error(error);
        }
    });
}

// 유효성 검사
function validation() {
    // 일반현황
    var leaderNo = $('#leaderNo').val();
    var schoolNo = $('#schoolNo').val();
    var leaderName = $('#leaderName').val();
    var birthday = $('#birthday').val();
    var gender = $("input[name='gender']:checked");
    var sportsNo = $('#sportsNo').val();
    var telNo1 = $("#telNo1").val();
    var telNo2 = $("#telNo2").val();
    var telNo3 = $("#telNo3").val();
    var empDT = $('#empDT').val()
    // 근무이력
    var historyStartDT = $('#historyStartDT').val();
    var historyEndDT = $('#historyEndDT').val();
    var historySchoolName = $('#historySchoolName').val();
    var historySportsNo = $('#historySportsNo').val();
    // 자격사항
    var certificateName = $('#certificateName').val();
    var certificateNumber = $('#certificateNumber').val();
    var certificateDT = $('#certificateDT').val();
    var organization = $('#organization').val();

    var check = /^[가-힣a-zA-Z]+$/
    var checkDate = /^[0-9]{4}[-]+[0-9]{2}[-]+[0-9]{2}$/;
    var checkTelNo = /^[0-9]{3}$/;
    var checkLeaderNo = /^JB[0-9]{2}[-]+[0-9]{3}$/;
    var checkSchoolNo = /^SC[0-9]{4}$/;
    var checkCertificateNumber = /^[a-zA-Z0-9]+$/;
    var checkCertificateName = /^[가-힣a-zA-Z0-9]+$/;

    if (!checkLeaderNo.test(leaderNo)) {
        console.warn("식별코드를 입력하세요.");
        return false;
    }

    if (!checkSchoolNo.test(schoolNo)) {
        console.warn("학교명을 입력하세요.");
        return false;
    }

    if (!check.test(leaderName)) {
        console.warn("성명을 입력하세요.");
        return false;
    }

    if (!checkDate.test(birthday)) {
        console.warn("생년월일을 입력하세요.");
        return false;
    }

    if (gender.length === 0) {
        console.warn("성별을 선택하세요.");
        return false;
    }

    if (!sportsNo) {
        console.warn("종목을 선택하세요.");
        return false;
    }

    if (!checkTelNo.test(telNo1) || !checkTelNo.test(telNo2) || !/^[0-9]{4}$/.test(telNo3)) {
        console.warn("근무지 전화번호를 입력하세요.\n(올바른 전화번호 형식이 아닙니다.(063-123-4567))");
        return false;
    }

    if (!checkDate.test(empDT)) {
        console.warn("최초채용일을 선택하세요.");
        return false;
    }

    if (!check.test(historySchoolName)) {
        console.warn("근무기관을 입력하세요.");
        return false;
    }

    if (!checkDate.test(historyStartDT)) {
        console.warn("근무시작일을 입력하세요.");
        return false;
    }

    if (!checkDate.test(historyEndDT)) {
        console.warn("근무종료일을 입력하세요.");
        return false;
    }

    if (!historySportsNo) {
        console.warn("근무종목을 선택하세요.");
        return false;
    }

    if (!checkCertificateName.test(certificateName)) {
        console.warn("자격/면허를 입력하세요.");
        return false;
    }

    if (!checkCertificateNumber.test(certificateNumber)) {
        console.warn("자격번호를 입력하세요.\n(영문, 숫자만 입력해주세요.)");
        return false;
    }

    if (!checkDate.test(certificateDT)) {
        console.warn("취득일자를 선택하세요.");
        return false;
    }

    if (!check.test(organization)) {
        console.warn("발급기관을 입력하세요.");
        return false;
    }

    return true;
}