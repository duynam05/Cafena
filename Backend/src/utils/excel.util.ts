import ExcelJS from 'exceljs';

export class ExcelUtil {
  static async exportProducts(products: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Cafena Coffee Management';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Danh Sách Sản Phẩm');

    worksheet.columns = [
      { header: 'Mã Sản Phẩm (ProductID)', key: 'ProductID', width: 18 },
      { header: 'Tên Sản Phẩm (ProductName)', key: 'ProductName', width: 35 },
      { header: 'Hình Ảnh (PathImage)', key: 'PathImage', width: 30 },
      { header: 'Loại Sản Phẩm (ProductType)', key: 'ProductType', width: 22 },
      { header: 'Số Lượng (Quantity)', key: 'Quantity', width: 15 },
      { header: 'Đơn Vị Tính (Unit)', key: 'Unit', width: 15 },
      { header: 'Giá Bán (Price)', key: 'Price', width: 18 },
      { header: 'Mô Tả (Description)', key: 'Description', width: 45 },
      { header: 'Độ Rang (RoastLevel)', key: 'roastLevel', width: 15 },
      { header: 'Hương Vị (FlavorNotes)', key: 'flavorNotes', width: 30 },
      { header: 'Nguồn Gốc (Origin)', key: 'origin', width: 25 },
      { header: 'Danh Mục', key: 'category', width: 22 },
      { header: 'Ngày Tạo (CreateDate)', key: 'CreateDate', width: 22 },
      { header: 'Ngày Cập Nhật (UpdateDate)', key: 'UpdateDate', width: 22 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF6F4E37' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    products.forEach((p) => {
      worksheet.addRow({
        ProductID: p.ProductID,
        ProductName: p.ProductName,
        PathImage: p.PathImage || '',
        ProductType: p.ProductType,
        Quantity: p.Quantity,
        Unit: p.Unit,
        Price: p.Price,
        Description: p.Description || '',
        roastLevel: p.roastLevel || '',
        flavorNotes: p.flavorNotes || '',
        origin: p.origin || '',
        category: p.category?.name || '',
        CreateDate: p.CreateDate ? new Date(p.CreateDate).toISOString() : '',
        UpdateDate: p.UpdateDate ? new Date(p.UpdateDate).toISOString() : '',
      });
    });

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }

  static async parseProducts(fileBuffer: Buffer): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error('File Excel không có nội dung trang tính');
    }

    const imported: any[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const values = row.values as any[];
      const productData = {
        ProductID: values[1] ? String(values[1]).trim() : undefined,
        ProductName: values[2] ? String(values[2]).trim() : undefined,
        PathImage: values[3] ? String(values[3]).trim() : null,
        ProductType: values[4] ? String(values[4]).trim() : 'Cà phê',
        Quantity: values[5] ? Number(values[5]) : 0,
        Unit: values[6] ? String(values[6]).trim() : 'gói',
        Price: values[7] ? Number(values[7]) : 0,
        Description: values[8] ? String(values[8]).trim() : null,
        roastLevel: values[9] ? String(values[9]).trim() : null,
        flavorNotes: values[10] ? String(values[10]).trim() : null,
        origin: values[11] ? String(values[11]).trim() : null,
      };

      if (productData.ProductName) {
        imported.push(productData);
      }
    });

    return imported;
  }
}

