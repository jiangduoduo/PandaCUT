var maskDatas= [];
var layersStatus = [];
var inputFolder;

var ad = app.activeDocument;
try {
    var maskSets = ad.layerSets.getByName("@PandaCUT_MASKS");
} catch (e) {
    alert("没有名为'@PandaCUT_MASKS'的蒙版组，无法启动脚本");
}

if(ad.mode != DocumentMode.RGB) {
    alert("图像模式必须为RGB才可以另存为PNG格式的文件,脚本退出！");
} else {
    if(maskSets)  {
        ad.suspendHistory("cutPictures", "main()");
    }
}

function main() {
    if (setInputFolder()) {
        var layers = ad.layers;
        
        getMaskDatas();
        
        saveLayersStatus(layers);
        
        cutPictures();
        
        var countObj = {count:0};
        resetVisibleStatus(layers, countObj);
        
        createConfigFile();
        
        alert("恭喜你，运行完成！！");
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
function saveLayersStatus(layers) {
     var layersCount = layers.length;
     for (var i = 0; i < layersCount; ++i) {
        layersStatus.push(layers[i].visible);
        if (layers[i].typename == "LayerSet") {
            saveLayersStatus(layers[i].layers);
        }
    }
}

/**根据蒙版信息裁剪图片**/
function cutPictures() {
    var layers = ad.layers;
    var history = ad.activeHistoryState;
    for (var i = 0; i < maskDatas.length; ++i) {
        var maskData = maskDatas[i];
        hideAllLayersAndSets(layers, false);
        var layer = layers.getByName("@PandaCUT_MASKS");
        layer.visible = false;
        showLayerByName(layers, maskData.name, false);
        mergeAllLayers(maskData.name);
        ad.crop(maskData.rect, 0);              //裁剪
        
        //另存为当前文档
        var fileOut = new File(inputFolder.fullName + "/" + maskData.name.substring(1) + ".png");
        var options = new PNGSaveOptions();
        var asCopy = true;
        var extensionType = Extension.LOWERCASE;
        ad.saveAs(fileOut, options, asCopy, extensionType);
        ad.activeHistoryState = history;
    }
}

/**隐藏所有图层，除了有@PC_NEVERHIDE标记的图层**/
function hideAllLayersAndSets(layers, inheritFlag) {
    //app.activeDocument.layers相当于取到了当前文件layer树结构下的第一层节点
    var layersCount = layers.length;
    for (var i = 0; i < layersCount; ++i) {
        var name = layers[i].name;
        var match = name.match("@PandaCUT_NEVERHIDE");
        if (inheritFlag) match = inheritFlag;
        if (match) layers[i].visible = true;
        else layers[i].visible = false;
        if (layers[i].typename == "LayerSet") {
            layers[i].visible = true;
            hideAllLayersAndSets(layers[i].layers, match);
        }
    }
}


/**根据蒙版名字筛选需要显示的图层**/
function showLayerByName(layers, maskName, inheritFlag) {
    var layersCount = layers.length;
    for (var i = 0; i < layersCount; ++i) {
        var match = inheritFlag;
        if (inheritFlag) {
            layers[i].visible = true;
        } else {
            var name = layers[i].name;
            var reg = new RegExp(maskName + "($|[\s@])");
            match = name.match(reg);
            if (match) layers[i].visible = true;
        }
        if (layers[i].typename == "LayerSet") {
            showLayerByName(layers[i].layers, maskName, match);
        }
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
function resetVisibleStatus(layers, countObj) {
    var layersCount = layers.length;
    for (var i = 0; i < layersCount; ++i) {
         layers[i].visible = layersStatus[countObj.count++];
         if (layers[i].typename == "LayerSet") {
            resetVisibleStatus(layers[i].layers, countObj);
        }
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
