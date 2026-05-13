const defaultConfig = {
    width: 300,
    height: 200,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    overflowX: 'auto',
    overflowY: 'auto',
    whiteSpace: 'normal',
    textOverflow: 'ellipsis',
    enableLineClamp: false,
    lineClamp: 2,
    borderWidth: 2,
    borderColor: '#0d6efd',
    backgroundColor: '#ffffff'
};

const elements = {
    widthRange: document.getElementById('widthRange'),
    widthInput: document.getElementById('widthInput'),
    heightRange: document.getElementById('heightRange'),
    heightInput: document.getElementById('heightInput'),
    paddingTop: document.getElementById('paddingTop'),
    paddingRight: document.getElementById('paddingRight'),
    paddingBottom: document.getElementById('paddingBottom'),
    paddingLeft: document.getElementById('paddingLeft'),
    linkPadding: document.getElementById('linkPadding'),
    borderTopLeftRadius: document.getElementById('borderTopLeftRadius'),
    borderTopRightRadius: document.getElementById('borderTopRightRadius'),
    borderBottomRightRadius: document.getElementById('borderBottomRightRadius'),
    borderBottomLeftRadius: document.getElementById('borderBottomLeftRadius'),
    linkRadius: document.getElementById('linkRadius'),
    overflowX: document.getElementById('overflowX'),
    overflowY: document.getElementById('overflowY'),
    whiteSpace: document.getElementById('whiteSpace'),
    textOverflow: document.getElementById('textOverflow'),
    enableLineClamp: document.getElementById('enableLineClamp'),
    lineClampControl: document.getElementById('lineClampControl'),
    lineClamp: document.getElementById('lineClamp'),
    borderWidth: document.getElementById('borderWidth'),
    borderColor: document.getElementById('borderColor'),
    backgroundColor: document.getElementById('backgroundColor'),
    backgroundColorText: document.getElementById('backgroundColorText'),
    showGrid: document.getElementById('showGrid'),
    resetBtn: document.getElementById('resetBtn'),
    previewBox: document.getElementById('previewBox'),
    previewContent: document.querySelector('.preview-content'),
    cssCode: document.getElementById('cssCode')
};

function syncRangeAndInput(rangeEl, inputEl, callback) {
    rangeEl.addEventListener('input', () => {
        inputEl.value = rangeEl.value;
        callback();
    });
    inputEl.addEventListener('input', () => {
        rangeEl.value = inputEl.value;
        callback();
    });
}

function syncLinkedInputs(primaryEl, inputs, checkbox) {
    primaryEl.addEventListener('input', () => {
        if (checkbox.checked) {
            inputs.forEach(input => input.value = primaryEl.value);
        }
        updatePreview();
    });
}

function setupPaddingSync() {
    const inputs = [elements.paddingTop, elements.paddingRight, elements.paddingBottom, elements.paddingLeft];
    inputs.forEach(input => {
        syncLinkedInputs(input, inputs, elements.linkPadding);
        input.addEventListener('input', updatePreview);
    });
}

function setupRadiusSync() {
    const inputs = [
        elements.borderTopLeftRadius,
        elements.borderTopRightRadius,
        elements.borderBottomRightRadius,
        elements.borderBottomLeftRadius
    ];
    inputs.forEach(input => {
        syncLinkedInputs(input, inputs, elements.linkRadius);
        input.addEventListener('input', updatePreview);
    });
}

function getConfig() {
    return {
        width: parseInt(elements.widthInput.value),
        height: parseInt(elements.heightInput.value),
        paddingTop: parseInt(elements.paddingTop.value),
        paddingRight: parseInt(elements.paddingRight.value),
        paddingBottom: parseInt(elements.paddingBottom.value),
        paddingLeft: parseInt(elements.paddingLeft.value),
        borderTopLeftRadius: parseInt(elements.borderTopLeftRadius.value),
        borderTopRightRadius: parseInt(elements.borderTopRightRadius.value),
        borderBottomRightRadius: parseInt(elements.borderBottomRightRadius.value),
        borderBottomLeftRadius: parseInt(elements.borderBottomLeftRadius.value),
        overflowX: elements.overflowX.value,
        overflowY: elements.overflowY.value,
        whiteSpace: elements.whiteSpace.value,
        textOverflow: elements.textOverflow.value,
        enableLineClamp: elements.enableLineClamp.checked,
        lineClamp: parseInt(elements.lineClamp.value),
        borderWidth: parseInt(elements.borderWidth.value),
        borderColor: elements.borderColor.value,
        backgroundColor: elements.backgroundColor.value
    };
}

function applyStyles(config) {
    const boxStyle = elements.previewBox.style;
    boxStyle.width = `${config.width}px`;
    boxStyle.height = `${config.height}px`;
    boxStyle.padding = `${config.paddingTop}px ${config.paddingRight}px ${config.paddingBottom}px ${config.paddingLeft}px`;
    boxStyle.borderTopLeftRadius = `${config.borderTopLeftRadius}px`;
    boxStyle.borderTopRightRadius = `${config.borderTopRightRadius}px`;
    boxStyle.borderBottomRightRadius = `${config.borderBottomRightRadius}px`;
    boxStyle.borderBottomLeftRadius = `${config.borderBottomLeftRadius}px`;
    boxStyle.overflowX = config.overflowX;
    boxStyle.overflowY = config.overflowY;
    boxStyle.border = `${config.borderWidth}px solid ${config.borderColor}`;
    boxStyle.backgroundColor = config.backgroundColor;
    boxStyle.position = 'relative';

    const contentStyle = elements.previewContent.style;
    if (config.enableLineClamp) {
        contentStyle.display = '-webkit-box';
        contentStyle.webkitBoxOrient = 'vertical';
        contentStyle.webkitLineClamp = config.lineClamp;
        contentStyle.overflow = 'hidden';
        contentStyle.whiteSpace = 'normal';
        contentStyle.textOverflow = config.textOverflow;
    } else {
        contentStyle.display = 'block';
        contentStyle.webkitBoxOrient = '';
        contentStyle.webkitLineClamp = 'none';
        contentStyle.whiteSpace = config.whiteSpace;
        contentStyle.textOverflow = config.textOverflow;
        if (config.whiteSpace === 'nowrap' && config.textOverflow === 'ellipsis') {
            contentStyle.overflow = 'hidden';
        }
    }
}

function generateCSSCode(config) {
    let textCss = '';
    if (config.enableLineClamp) {
        textCss = `\n\n.content {\n` +
            `  display: -webkit-box;\n` +
            `  -webkit-box-orient: vertical;\n` +
            `  -webkit-line-clamp: ${config.lineClamp};\n` +
            `  overflow: hidden;\n` +
            `  text-overflow: ${config.textOverflow};\n` +
            `}`;
    } else {
        const needOverflow = config.whiteSpace === 'nowrap' && config.textOverflow === 'ellipsis';
        textCss = `\n\n.content {\n` +
            `  white-space: ${config.whiteSpace};\n` +
            `  text-overflow: ${config.textOverflow};\n` +
            (needOverflow ? `  overflow: hidden;\n` : '') +
            `}`;
    }
    
    const css = `.container {\n` +
        `  width: ${config.width}px;\n` +
        `  height: ${config.height}px;\n` +
        `  padding: ${config.paddingTop}px ${config.paddingRight}px ${config.paddingBottom}px ${config.paddingLeft}px;\n` +
        `  border: ${config.borderWidth}px solid ${config.borderColor};\n` +
        `  border-radius: ${config.borderTopLeftRadius}px ${config.borderTopRightRadius}px ${config.borderBottomRightRadius}px ${config.borderBottomLeftRadius}px;\n` +
        `  overflow-x: ${config.overflowX};\n` +
        `  overflow-y: ${config.overflowY};\n` +
        `  background-color: ${config.backgroundColor};\n` +
        `}` + textCss;
    elements.cssCode.textContent = css;
}

function updatePreview() {
    const config = getConfig();
    applyStyles(config);
    generateCSSCode(config);
}

function resetToDefault() {
    elements.widthRange.value = defaultConfig.width;
    elements.widthInput.value = defaultConfig.width;
    elements.heightRange.value = defaultConfig.height;
    elements.heightInput.value = defaultConfig.height;
    elements.paddingTop.value = defaultConfig.paddingTop;
    elements.paddingRight.value = defaultConfig.paddingRight;
    elements.paddingBottom.value = defaultConfig.paddingBottom;
    elements.paddingLeft.value = defaultConfig.paddingLeft;
    elements.borderTopLeftRadius.value = defaultConfig.borderTopLeftRadius;
    elements.borderTopRightRadius.value = defaultConfig.borderTopRightRadius;
    elements.borderBottomRightRadius.value = defaultConfig.borderBottomRightRadius;
    elements.borderBottomLeftRadius.value = defaultConfig.borderBottomLeftRadius;
    elements.overflowX.value = defaultConfig.overflowX;
    elements.overflowY.value = defaultConfig.overflowY;
    elements.whiteSpace.value = defaultConfig.whiteSpace;
    elements.textOverflow.value = defaultConfig.textOverflow;
    elements.enableLineClamp.checked = defaultConfig.enableLineClamp;
    elements.lineClamp.value = defaultConfig.lineClamp;
    elements.lineClampControl.style.display = defaultConfig.enableLineClamp ? 'block' : 'none';
    elements.borderWidth.value = defaultConfig.borderWidth;
    elements.borderColor.value = defaultConfig.borderColor;
    elements.backgroundColor.value = defaultConfig.backgroundColor;
    elements.backgroundColorText.value = defaultConfig.backgroundColor;
    updatePreview();
}

function init() {
    syncRangeAndInput(elements.widthRange, elements.widthInput, updatePreview);
    syncRangeAndInput(elements.heightRange, elements.heightInput, updatePreview);
    setupPaddingSync();
    setupRadiusSync();
    elements.overflowX.addEventListener('change', updatePreview);
    elements.overflowY.addEventListener('change', updatePreview);
    elements.whiteSpace.addEventListener('change', updatePreview);
    elements.textOverflow.addEventListener('change', updatePreview);
    elements.enableLineClamp.addEventListener('change', () => {
        elements.lineClampControl.style.display = elements.enableLineClamp.checked ? 'block' : 'none';
        updatePreview();
    });
    elements.lineClamp.addEventListener('input', updatePreview);
    elements.borderWidth.addEventListener('input', updatePreview);
    elements.borderColor.addEventListener('input', updatePreview);
    elements.backgroundColor.addEventListener('input', () => {
        elements.backgroundColorText.value = elements.backgroundColor.value;
        updatePreview();
    });
    elements.backgroundColorText.addEventListener('input', () => {
        const color = elements.backgroundColorText.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
            elements.backgroundColor.value = color;
            updatePreview();
        }
    });
    elements.showGrid.addEventListener('change', () => {
        elements.previewBox.classList.toggle('with-grid', elements.showGrid.checked);
    });
    elements.resetBtn.addEventListener('click', resetToDefault);
    updatePreview();
}

document.addEventListener('DOMContentLoaded', init);
