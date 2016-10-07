"use strict";
var a;
var b;

function getMessage(a, b) {
    var aType = typeof a;
    var bType = typeof b;
    
    if (aType == "boolean") {
        if (a) {
            return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
        }
        return "Переданное GIF-изображение не анимировано";
    } else if (aType == "number") {
        return "Переданное SVG-изображение содержит " + a + " объектов и " + b * 4 + " атрибутов";
    } else if (aType == "object" && bType != "object") {
        var index;
        var amountOfRedPoints = 0;
        
        for (index = 0; index < a.length; index++) {
            amountOfRedPoints = amountOfRedPoints + a[index];
        }
        return "Количество красных точек во всех строчках изображения: " + amountOfRedPoints;
    } else if (aType == "object" && bType == "object") {
        var artifactsSquare = 0;
        
        for (index = 0; index < a.length; index++) {
            a[index] = a[index] * b[index];
        }
        for (index = 0; index < a.length; index++) {
            artifactsSquare = artifactsSquare + a[index];
        }
        return "Общая площадь артефактов сжатия: " + artifactsSquare + " пикселей";
    }
    
    return "Переданы некорректные данные";    
}    