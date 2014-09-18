angular.module('stateTransitions', [])
    .constant('StateTransitions',
    {
        "enum.areaDetail.house": {to: "enum.houseDetail.basicInf", param: "houseId"},
        "enum.houseDetail.household": {to: "enum.householdDetail.visit", param: "householdId"},
        "enum.householdDetail.member": {to: "enum.memberDetail.basicInf", param: "memberId"},
        "enum.householdDetail.visit": {to: "enum.visitDetail.basicInf", param: "visitId"},
        "enum.householdDetail.head": {to: "enum.headDetail.basicInf", param: "memberId"},
        "enum.householdDetail.hosp": {to: "enum.hospDetail.basicInf", param: "memberId"},
        "enum.householdDetail.death": {to: "enum.deathDetail.basicInf", param: "memberId"},
        "hc.householdDetail.visit": {to: "hc.visitDetail.basicInf", param: ""}

    }

)