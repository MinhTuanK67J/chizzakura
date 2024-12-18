'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "INSERT INTO `categories` VALUES (1,'NEM','2024-12-07 16:07:27','2024-12-07 16:07:27'),(2,'CHÂN GÀ','2024-12-07 16:07:27','2024-12-07 16:07:27'),(3,'COMBO MỚI','2024-12-07 16:07:27','2024-12-07 16:07:27'),(4,'KEM','2024-12-07 16:07:27','2024-12-07 16:07:27'),(5,'CƠM','2024-12-07 16:07:27','2024-12-07 16:07:27'),(6,'ĐỒ ĂN','2024-12-07 16:07:27','2024-12-07 16:07:27'),(7,'TRÀ CHANH','2024-12-07 16:07:27','2024-12-07 16:07:27'),(8,'MỲ CAY','2024-12-07 16:07:27','2024-12-07 16:07:27'),(9,'MỲ TRỘN','2024-12-07 16:07:27','2024-12-07 16:07:27'),(10,'SODA','2024-12-07 16:07:27','2024-12-07 16:07:27'),(11,'BÚN','2024-12-07 16:07:27','2024-12-07 16:07:27'),(12,'NƯỚC NGỌT','2024-12-07 16:07:27','2024-12-07 16:07:27'),(13,'NƯỚC ÉP','2024-12-07 16:07:27','2024-12-07 16:07:27'),(14,'SINH TỐ','2024-12-07 16:07:27','2024-12-07 16:07:27'),(15,'TÀO PHỚ','2024-12-07 16:07:27','2024-12-07 16:07:27'),(16,'TOKBOKKI','2024-12-07 16:07:27','2024-12-07 16:07:27'),(17,'MATCHA','2024-12-07 16:07:27','2024-12-07 16:07:27'),(18,'CHÈ','2024-12-07 16:07:27','2024-12-07 16:07:27'),(19,'SỮA CHUA','2024-12-07 16:07:27','2024-12-07 16:07:27'),(20,'TRÀ SỮA','2024-12-07 16:07:27','2024-12-07 16:07:27'),(21,'CƠM APP','2024-12-07 16:07:27','2024-12-07 16:07:27');"
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
    await queryInterface.sequelize.query(
      "ALTER TABLE categories AUTO_INCREMENT = 1"
    );
  }
};
