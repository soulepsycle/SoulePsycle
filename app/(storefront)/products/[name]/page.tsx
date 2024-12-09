import { ProductCard } from "@/app/components/storefront/ProductCard";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getData(productCategory: string) {
  switch (productCategory) {
    case "all": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: "published",
        },
      });

      return {
        title: "All Products",
        data: data,
      };
    }
    case "tote_bag": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "tote_bag",
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "Tote Bags",
        data: data,
      };
    }
    case "t_shirt": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "t_shirt",
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "T-shirts",
        data: data,
      };
    }
    case "jeans": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "jeans",
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "Jeans",
        data: data,
      };
    }
    case "hoodies": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "hoodies",
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "Hoodies",
        data: data,
      };
    }
    case "sneakers": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "sneakers",
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "Sneakers",
        data: data,
      };
      
    }
    case "backpacks": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          category: "backpacks",
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "Backpacks",
        data: data,
      };
    }
    default: {
      return notFound();
    }
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: { name: string };
}) {
  noStore();
  const { data, title } = await getData(params.name);
  return (
    <section>
      <h1 className="font-semibold text-3xl my-5">{title}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}
