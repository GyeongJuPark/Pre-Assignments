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
