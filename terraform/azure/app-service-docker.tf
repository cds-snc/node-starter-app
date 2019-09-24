resource "azurerm_app_service_plan" "app_service_plan" {
  name                = "${var.name}-asp"
  location            = "${azurerm_resource_group.resource_group.location}"
  resource_group_name = "${azurerm_resource_group.resource_group.name}"
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Standard"
    size = "B1"
  }
}

resource "azurerm_app_service" "app_service" {
  name                = "${var.name}-appservice"
  location            = "${azurerm_resource_group.resource_group.location}"
  resource_group_name = "${azurerm_resource_group.resource_group.name}"
  app_service_plan_id = "${azurerm_app_service_plan.app_service_plan.id}"

  site_config {
    linux_fx_version = "DOCKER|${azurerm_container_registry.container_registry.login_server}/${var.docker_image}:${var.docker_image_tag}"
    http2_enabled    = true
    always_on        = true
  }

  app_settings = {
    "DOCKER_ENABLE_CI"                = "true"
    "DOCKER_REGISTRY_SERVER_URL"      = "https://${azurerm_container_registry.container_registry.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME" = "${azurerm_container_registry.container_registry.admin_username}"
    "DOCKER_REGISTRY_SERVER_PASSWORD" = "${azurerm_container_registry.container_registry.admin_password}"
  }
}
