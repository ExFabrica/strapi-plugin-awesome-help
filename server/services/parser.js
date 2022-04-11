'use strict';

module.exports = ({ strapi }) => {
  const getContentTypes = () => {
    let contentTypes = [];
    Object.values(strapi.contentTypes).map(contentType => {
      if ((contentType.kind === "collectionType" || contentType.kind === "singleType") && !contentType.plugin) {
        contentTypes.push(contentType);
      }
    });
    return contentTypes;
  };
  const getStructure = (item, contentType, type, componentName, zoneName, parentComponentName) => {
    for (const [attributeKey, attributeValue] of Object.entries(contentType.attributes)) {
      switch (attributeValue.type) {
        case "text":
        case "string":
        case "biginteger":
        case "float":
        case "decimal":
        case "integer":
          switch (type) {
            case "component":
              item.attributes.push({ fieldName: attributeKey, value: attributeValue, containerType: "component", componentName: componentName });
              break;
            case "componentInZone":
              item.attributes.push({ fieldName: attributeKey, value: attributeValue, containerType: "componentInZone", zoneName: zoneName, componentName: componentName });
              break;
            case "nestedComponentInComponentInZone":
              item.attributes.push({ fieldName: attributeKey, value: attributeValue, containerType: "nestedComponentInComponentInZone", zoneName: `${zoneName}/${parentComponentName}`, componentName: componentName });
              break;
            case "default":
              item.attributes.push({ fieldName: attributeKey, value: attributeValue, containerType: "default" });
              break;
          }
        case "component":
          switch (type) {
            case "default":
              const component = strapi.components[attributeValue.component];
              if (component)
                getStructure(item, component, "component", attributeKey);
              break;
            case "componentInZone":
              const zoneComponentInZone = strapi.components[attributeValue.component];
              if (zoneComponentInZone)
                getStructure(item, zoneComponentInZone, "nestedComponentInComponentInZone", attributeKey, zoneName, componentName);
              break;
          }
          break;
        case "dynamiczone":
          if (type === "default") {
            for (const componentName of attributeValue.components) {
              const component = strapi.components[componentName];
              getStructure(item, component, "componentInZone", componentName, attributeKey);
            }
          }
          break;
        default:
          break;
      }
    }
  };
  const checkStructureHasChanged = async () => {
    const attributes = getAttributesFromStrapiContentType();
    const fields = mapHelpEntitiesFromAnalysedResults(attributes);
    const helpEntities = await strapi.plugin("awesome-help").service("helpService").findMany();
    const fieldsToDelete = checkFieldsToDelete(helpEntities, fields);
    const fieldsToCreate = checkFieldsToCreate(helpEntities, fields);
    return (fieldsToDelete && fieldsToDelete.length) > 0 || (fieldsToCreate && fieldsToCreate.length > 0)
  };
  const checkFieldsToDelete = (helpEntities, fields) => {
    return helpEntities.filter(entity => !fields.map(field => field.path).includes(entity.path));
  };
  const checkFieldsToCreate = (helpEntities, fields) => {
    return fields.filter(field => !helpEntities.map(entity => entity.path).some(path => path === field.path));
  };
  const synchronize = async (fields) => {
    const helpEntities = await strapi.plugin("awesome-help").service("helpService").findMany();
    const fieldsToDelete = checkFieldsToDelete(helpEntities, fields);
    if (fieldsToDelete && fieldsToDelete.length > 0) {
      console.debug("Some new fields are to delete", fieldsToDelete);
      for (let i = 0; i < fieldsToDelete.length; i++) {
        await strapi.plugin("awesome-help").service("helpService").deleteOne(
          {
            where: {
              id: {
                $eq: fieldsToDelete[i].id
              }
            }
          });
      }
    }
    const fieldsToCreate = checkFieldsToCreate(helpEntities, fields);
    if (fieldsToCreate && fieldsToCreate.length > 0) {
      console.debug("Some new fields are to create", fieldsToCreate);
      await strapi.plugin("awesome-help").service("helpService").createMany(fieldsToCreate);
    }
  };
  const getComponentName = (componentName) => {
    return componentName && componentName.indexOf(".") > -1 ? componentName.split(".")[1] : componentName;
  };
  const getZoneName = (zoneName) => {
    return zoneName && zoneName.indexOf("/") > -1 && zoneName.indexOf(".") > -1 ? zoneName.split("/")[1].replace(".", "/") : zoneName;
  };
  const getPath = (attribute, contentType) => {
    switch (attribute.containerType) {
      case "component":
        return `${contentType}/${attribute.componentName}/${attribute.fieldName}`;
      case "componentInZone":
        return `${contentType}/${attribute.zoneName}/${getComponentName(attribute.componentName)}/${attribute.fieldName}`;
      case "nestedComponentInComponentInZone":
        return `${contentType}/${getZoneName(attribute.zoneName)}/${attribute.componentName}/${attribute.fieldName}`;
      default:
        return `${contentType}/${attribute.fieldName}`;
    }
  };
  const mapHelpEntitiesFromAnalysedResults = (results) => {
    let helpEntities = [];
    for (const contentType of results) {
      for (const attribute of contentType.attributes) {
        helpEntities.push({
          helpContent: "",
          path: getPath(attribute, contentType.uid),
          contentType: contentType.uid,
          fieldName: attribute.fieldName,
          containerType: attribute.containerType,
          zoneName: attribute.zoneName,
          componentName: attribute.componentName
        });
      }
    }
    return helpEntities;
  };
  const createHelpEntities = async (results) => {
    let fields = mapHelpEntitiesFromAnalysedResults(results);
    if (fields && fields.length > 0) {
      const count = await strapi.plugin("awesome-help").service("helpService").count();
      if (count === 0)
        await strapi.plugin("awesome-help").service("helpService").createMany(fields);
      else
        await synchronize(fields);
    }
  };
  const getAttributesFromStrapiContentType = async () => {
    let potentialFields = [];
    let contentTypes = getContentTypes();
    if (contentTypes && contentTypes.length > 0) {
      for (const contentType of contentTypes) {
        let item = {
          uid: contentType.uid,
          kind: contentType.kind,
          attributes: [],
        }
        getStructure(item, contentType, "default");
        potentialFields.push(item);
      }
    }
    else {
      const helps = await strapi.plugin("awesome-help").service("helpService").findMany();
      if (helps && helps.length > 0)
        await strapi.plugin("awesome-help").service("helpService").deleteAll();
    }
    const fields = potentialFields.filter(content => content.attributes.length > 0);
    return fields ?? [];
  }
  const parse = async () => {
    //await strapi.plugin("awesome-help").service("helpService").deleteAll();
    const attributes = await getAttributesFromStrapiContentType();
    await createHelpEntities(attributes);
  };
  return {
    parse,
    checkStructureHasChanged
  };
}
