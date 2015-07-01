var maskDatas= [];
var layersStatus = [];
var inputFolder;

var ad = app.activeDocument;
try {
    var maskSets = ad.layerSets.getByName("@PandaCUT_MASKS");
} catch (e) {
    alert("没有名为'@PandaCUT_MASKS'的蒙版组，无法启动脚本");
}

if(maskSets)  {
    ad.suspendHistory("cutPictures", "main()");
}

function main() {
    if (setInputFolder()) {
        
        getMaskDatas();
        
        saveLayersStatus();
        
        cutPictures();
        
        resetVisibleStatus();
        
        createConfigFile();
    } else {
        alert("没有选择文件夹，脚本退出");
    }
}

/**选择导入切好图片的文件夹**/
function setInputFolder() {
    inputFolder = Folder.selectDialog("选择导入的文件夹：");
    return inputFolder;
}

/**获取蒙版的信息**/
function getMaskDatas() {
    var layers = maskSets.layers;
    var layersCount = layers.length;
    for (var i = 0; i < layersCount; ++i) {
        var o = {};
        o.name = layers[i].name;
        o.rect = layers[i]. bounds;
        maskDatas[i] = o;
    }
}

/**存储所有图层的显示状态**/
function saveLayersStatus() {
    var layers = ad.layers;
    var layersCount = layers.length;
    for (var i = 0; i < layersCount; ++i) {
        layersStatus[i] = layers[i].visible;
    }
}

/**根据蒙版信息裁剪图片**/
function cutPictures() {
    var history = ad.activeHistoryState;
    for (var i = 0; i < maskDatas.length; ++i) {
        var maskData = maskDatas[i];
        hideAllLayersAndSets();
        showLayerByName(maskData.name);
        mergeAllLayers(maskData.name);
        ad.crop(maskData.rect, 0);              //裁剪
        
        //另存为当前文档
        var fileOut = new File(inputFolder.fullName + "/" + maskData.name.substring(1));
        var options = PNGSaveOptions;
        var asCopy = true;
        var extensionType = Extension.LOWERCASE;
        ad.saveAs(fileOut, options, asCopy, extensionType);
        ad.activeHistoryState = history;
    }
}

/**隐藏所有图层，除了有@PC_NEVERHIDE标记的图层**/
function hideAllLayersAndSets() {
    //app.activeDocument.layers相当于取到了当前文件layer树结构下的第一层节点
    var layers = ad.layers;
    var layersCount = layers.length;
    for (var i = 0; i < layersCount; ++i) {
        var name = layers[i].name;
        var match = name.match("@PandaCUT_NEVERHIDE");
        if (!match) layers[i].visible = false;
    }
}


/**根据蒙版名字筛选需要显示的图层**/
function showLayerByName(maskName) {
    var layers = ad.layers;
    var layersCount = layers.length;
    for (var i = 0; i < layersCount; ++i) {
        var name = layers[i].name;
        var match = name.match(maskName);
        if (match) layers[i].visible = true;
    }
}

/**合并所有显示图层，以蒙版名字命名**/
function mergeAllLayers(maskName) {
    //当前选中的layer不能是visible等于false的,否则合并图层的时候新图层没法起名。
    //创建新图层，在photoshop里artlayer等于layer;
    var newLayer = ad.artLayers.add();
    newLayer.name = maskName;
    ad.activeLayer = ad.layers.getByName(maskName);
    
    ad.mergeVisibleLayers();
}

/**重置各个图层的状态到初始状态**/
function resetVisibleStatus() {
    var layers = ad.layers;
    var layersCount = layers.length;
    for (var i = 0; i < layersCount; ++i) {
         layers[i].visible = layersStatus[i];
    }
}

/**创建JUCE用的C++代码，JUCE程序员专用**/
function createConfigFile() {
     var fileOut = new File(inputFolder.fullName + "/config.txt");
     fileOut.open("w");
     var text  = "";
     for (var i = 0; i < maskDatas.length; ++i) {
         var data = maskDatas[i];
         var name = data.name.substring(1);
         text += name + ' = ImageCache::getFromFile(file.getChildFile("' + name +'.png"));\n';
         text += 'if (' + name +'.isNull()) throw Expression("Resource file: ' + name + '.png are missing!!!");\n';
     }
    text += "\n";
    fileOut.write(text);
    
    text = "";
     for (var i = 0; i < maskDatas.length; ++i) {
         var data = maskDatas[i];
         var name = data.name.substring(1);
         text += name +' = ImageCache::getFromMemory(BinaryData::' + name +'_png,BinaryData::' + name +'_pngSize);\n';
     }
    text += "\n";
    fileOut.write(text);
    
    text = "";
     for (var i = 0; i < maskDatas.length; ++i) {
         var data = maskDatas[i];
         var name = data.name.substring(1);
         var x  = parseInt(data.rect[0]);
         var y = parseInt(data.rect[1]);
         var w = parseInt(data.rect[2]) - parseInt(data.rect[0]);
         var h = parseInt(data.rect[3]) - parseInt(data.rect[1]);
         text += name + '.setBounds(' + x + ', ' + y + ', ' + w + ', ' + h + ');\n';
     }
    text += "\n";
    fileOut.write(text);
    
    fileOut.close();
}

function showObj(obj) {
    var str = "";
    for (var x in obj) {
        str += x + ":"  + obj[x] + "\n";
    }
    alert(str);
}