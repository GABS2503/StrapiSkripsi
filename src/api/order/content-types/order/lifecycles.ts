export default {
  async afterCreate(event: any) {
    const { result } = event;

    try {
      // 1. Get the items from the newly created order
      let items = result.items;
      
      // If the items were sent as a JSON string from Next.js, parse them into an array
      if (typeof items === 'string') {
        items = JSON.parse(items);
      }

      // 2. Loop through every item the buyer purchased
      if (items && Array.isArray(items)) {
        for (const item of items) {
          
          // Only decrease stock if the item is a 'product' (ignore 'services' which don't run out)
          if (item.type === 'product' || !item.type) {
            
            // 3. Find the original product in the database using Strapi v5 Document API
            const product: any = await strapi.documents('api::product.product').findOne({
              documentId: item.id,
            });

            // 4. If the product exists and has a stock number
            if (product && typeof product.stock === 'number') {
              
              // Calculate the new stock (Math.max prevents stock from going into minus numbers)
              const newStock = Math.max(0, product.stock - item.quantity);
              
              // 5. Update the product database with the new stock!
              await strapi.documents('api::product.product').update({
                documentId: item.id,
                data: {
                  stock: newStock,
                },
              });
              
              console.log(`✅ Success: Reduced stock for product ${product.name} to ${newStock}`);
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ Error automatically updating stock:", error);
    }
  },
};
