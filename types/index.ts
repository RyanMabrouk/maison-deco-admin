import { UseQueryOptions } from '@tanstack/react-query';
import { Database, Tables } from './database.types';
import { Merge } from 'type-fest';

// export interface NavItemWithChildren extends NavItem {
//   items: NavItemWithChildren[];
// }

// export interface NavItemWithOptionalChildren extends NavItem {
//   items?: NavItemWithChildren[];
// }

// export interface FooterItem {
//   title: string;
//   items: {
//     title: string;
//     href: string;
//     external?: boolean;
//   }[];
// }

// export type MainNavItem = NavItemWithOptionalChildren;

// export type SidebarNavItem = NavItemWithChildren;

export type IValidationErrors<T extends object> = {
  [key in keyof T]: string[];
};

export type QueryReturnType<T extends (args: any) => UseQueryOptions> = Awaited<
  ReturnType<
    ReturnType<T>['queryFn'] extends (...args: any) => any
      ? ReturnType<T>['queryFn']
      : never
  >
>;

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export type IDbTableName = keyof Database[Extract<
  keyof Database,
  'public'
>]['Tables'];

export interface GenericOps<T extends IDbTableName> {
  pagination: {
    page: number;
    limit: number;
  };
  match?: Partial<{ [k in keyof Tables<T>]: Tables<T>[k] }>;
}

export type TypedDatabase = Merge<
  Database,
  {
    public: {
      Tables: {
        products: {
          Row: {
            size: {
              id: number;
              name: string;
              product_id: number;
            };
          };
        };
      };
    };
  }
>;
