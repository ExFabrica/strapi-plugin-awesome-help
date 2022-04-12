import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Context from Strapi Helper.
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
// Css for tooltip component
import './strapi-tooltip.css';

export const StrapiUIDecorator = ({ helpItems, enable }) => {
  const { modifiedData } = useCMEditViewDataManager();
  const [nodeElementsCollectionCount, setNodeElementsCollectionCount] = useState(0);
  const [structureFields, setStructureFields] = useState([]);
  const [innerInterval, setInnerInterval] = useState(0);

  useEffect(() => {
    htmlLookup();
  }, [nodeElementsCollectionCount, modifiedData]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(innerInterval);
    };
  }, [innerInterval]);

  useEffect(() => {
    if (!enable) {
      reset();
    }
    else {
      setStructureFields(helpItems);
      const interval = window.setInterval(() => {
        countAllTags();
      }, 500);
      setInnerInterval(interval);
    }
  }, [enable]);

  const reset = () => {
    setStructureFields([]);
    setNodeElementsCollectionCount(0);
    clearInterval(innerInterval);
    setInnerInterval(0);
    let labels = document.querySelectorAll('[id^="awesome_help_"]');
    labels.forEach(label => {
      label.remove();
    });
  };
  const countAllTags = () => {
    const labelNodes = document.querySelectorAll("label");
    const labelNodeList = [...labelNodes];
    const labelsInnerText = labelNodeList.map(item => item.innerText);
    if (labelsInnerText && labelsInnerText.length > 0) {
      const innerTextString = labelsInnerText.join("\n");
      setNodeElementsCollectionCount(innerTextString.length);
    }
  };
  const htmlLookup = () => {
    if (structureFields) {
      for (const structureField of structureFields) {
        //field is a component ?
        if (structureField.componentName) {
          // component is in zoneName ?
          if (structureField.zoneName)
            createTooltipInZone(structureField);
          else
            createTooltip(`${structureField.componentName}.${structureField.fieldName}`, structureField);
        }
        else
          // field is a single field
          createTooltip(structureField.fieldName, structureField);
      }
    }
  };
  const createTooltipInZone = (structureField) => {
    //field directly accesible in zoneName
    if (!structureField.zoneName.includes("/")) {
      if (modifiedData && modifiedData[structureField.zoneName]) {
        const dynamicZoneComponents = modifiedData[structureField.zoneName].map(item => item.__component);
        const index = dynamicZoneComponents.indexOf(structureField.componentName);
        if (index > -1) {
          createTooltip(`${structureField.zoneName}.${index}.${structureField.fieldName}`, structureField);
        }
      }
    }
    else {
      // field is a nested component inside a zoneName.
      const splittedNames = structureField.zoneName.split("/");
      const zoneName = splittedNames[0];
      const componentName = splittedNames[1];
      if (modifiedData && modifiedData[zoneName]) {
        const dynamicZoneComponents = modifiedData[zoneName].map(item => item.__component);
        const componentIndex = dynamicZoneComponents.indexOf(componentName);
        if (componentIndex > -1) {
          const documentParentComponent = modifiedData[zoneName].filter(item => item.__component === componentName);
          if (documentParentComponent && documentParentComponent.length > 0) {
            const innerComponent = documentParentComponent[0][structureField.componentName];
            // repeatable component
            if (_.isArray(innerComponent)) {
              innerComponent.forEach((element, index) => {
                createTooltip(`${zoneName}.${componentIndex}.${structureField.componentName}.${index}.${structureField.fieldName}`, structureField);
              });
            }
            // simple component
            else
              createTooltip(`${zoneName}.${componentIndex}.${structureField.componentName}.${structureField.fieldName}`, structureField);
          }
        }
      }
    }
  };
  const createTooltip = (fieldToSearch, structureField) => {
    const query = `label[for='${fieldToSearch}']`;
    const label = document.querySelector(query);
    if (label) {
      const div = label.querySelector("div");
      const spans = label.querySelectorAll('[id^="awesome_help_"]');
      // create tooltip only if don't exist
      if (spans.length === 0) {
        let span = document.createElement("span");
        span.id = `awesome_help_${structureField.id}`;
        span.className = "awesome-help-tooltip";
        span.innerHTML = `&#x1F916;<span class="awesome-help-tooltipText">${structureField.helpContent.replace(/(?:\n)/g, '<br>')}</span>`;
        div ? div.appendChild(span) : label.appendChild(span);
      }
    }
  };
  return <></>;
}

StrapiUIDecorator.defaultProps = {
  helpItems: [],
  enable: PropTypes.bool.isRequired,
};
