import * as xml2js from 'xml2js';

export class XmlUtil {
  static async exportProducts(products: any[]): Promise<string> {
    const builder = new xml2js.Builder({
      rootName: 'products',
      headless: false,
    });

    const xmlObject = {
      product: products.map((p) => ({
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
      })),
    };

    return builder.buildObject(xmlObject);
  }

  static async parseProducts(xmlString: string): Promise<any[]> {
    const parser = new xml2js.Parser({ explicitArray: false, trim: true });
    let parsed: any;
    try {
      parsed = await parser.parseStringPromise(xmlString);
    } catch {
      throw new Error('Định dạng XML không hợp lệ');
    }

    if (!parsed || !parsed.products || !parsed.products.product) {
      throw new Error('Tệp XML không tìm thấy thẻ <products><product>...</product></products>');
    }

    const rawList = Array.isArray(parsed.products.product)
      ? parsed.products.product
      : [parsed.products.product];

    return rawList.map((item: any) => ({
      ProductID: item.ProductID,
      ProductName: item.ProductName,
      PathImage: item.PathImage,
      ProductType: item.ProductType || 'Cà phê',
      Quantity: Number(item.Quantity) || 0,
      Unit: item.Unit || 'gói',
      Price: Number(item.Price) || 0,
      Description: item.Description,
      roastLevel: item.roastLevel,
      flavorNotes: item.flavorNotes,
      origin: item.origin,
    }));
  }
}

