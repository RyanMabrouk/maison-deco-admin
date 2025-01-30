export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      carousels: {
        Row: {
          created_at: string | null
          id: string
          redirect_url: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          redirect_url: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          redirect_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      carousels_translations: {
        Row: {
          carousel_item_id: string
          created_at: string | null
          image_url: string
          lang: Database["public"]["Enums"]["languages_enum"]
          updated_at: string | null
        }
        Insert: {
          carousel_item_id: string
          created_at?: string | null
          image_url: string
          lang: Database["public"]["Enums"]["languages_enum"]
          updated_at?: string | null
        }
        Update: {
          carousel_item_id?: string
          created_at?: string | null
          image_url?: string
          lang?: Database["public"]["Enums"]["languages_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carousels_translations_carousel_item_id_fkey"
            columns: ["carousel_item_id"]
            isOneToOne: false
            referencedRelation: "carousels"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          parent_slug: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          parent_slug?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          parent_slug?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_slug_fkey"
            columns: ["parent_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      categories_translations: {
        Row: {
          category_slug: string
          created_at: string | null
          lang: Database["public"]["Enums"]["languages_enum"]
          title: string | null
          updated_at: string | null
        }
        Insert: {
          category_slug: string
          created_at?: string | null
          lang: Database["public"]["Enums"]["languages_enum"]
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          category_slug?: string
          created_at?: string | null
          lang?: Database["public"]["Enums"]["languages_enum"]
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_translations_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount: number
          discount_type: Database["public"]["Enums"]["discount_type"]
          id: string
          times_used: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount: number
          discount_type: Database["public"]["Enums"]["discount_type"]
          id?: string
          times_used?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount?: number
          discount_type?: Database["public"]["Enums"]["discount_type"]
          id?: string
          times_used?: number
        }
        Relationships: []
      }
      faq_translations: {
        Row: {
          answer: string
          created_at: string | null
          faq_id: string
          lang: Database["public"]["Enums"]["languages_enum"]
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          faq_id: string
          lang: Database["public"]["Enums"]["languages_enum"]
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          faq_id?: string
          lang?: Database["public"]["Enums"]["languages_enum"]
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_translations_faq_id_fkey"
            columns: ["faq_id"]
            isOneToOne: false
            referencedRelation: "faqs"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      highlight_products: {
        Row: {
          created_at: string
          highlight_slug: string
          product_slug: string
        }
        Insert: {
          created_at?: string
          highlight_slug: string
          product_slug: string
        }
        Update: {
          created_at?: string
          highlight_slug?: string
          product_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "highlight_products_highlight_slug_fkey"
            columns: ["highlight_slug"]
            isOneToOne: false
            referencedRelation: "highlights"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "highlight_products_product_slug_fkey"
            columns: ["product_slug"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["slug"]
          },
        ]
      }
      highlights: {
        Row: {
          created_at: string
          slug: string
        }
        Insert: {
          created_at?: string
          slug: string
        }
        Update: {
          created_at?: string
          slug?: string
        }
        Relationships: []
      }
      highlights_translations: {
        Row: {
          created_at: string
          highlight_slug: string
          lang: Database["public"]["Enums"]["languages_enum"]
          title: string
        }
        Insert: {
          created_at?: string
          highlight_slug: string
          lang: Database["public"]["Enums"]["languages_enum"]
          title: string
        }
        Update: {
          created_at?: string
          highlight_slug?: string
          lang?: Database["public"]["Enums"]["languages_enum"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "highlights_translations_highlight_slug_fkey"
            columns: ["highlight_slug"]
            isOneToOne: false
            referencedRelation: "highlights"
            referencedColumns: ["slug"]
          },
        ]
      }
      orders: {
        Row: {
          bill_url: string
          cancel_reason: string
          country: string | null
          created_at: string
          delivered_at: string | null
          delivery_fee: number
          id: string
          items: Json[] | null
          payment_method: string
          phone: string | null
          shipping_address: string
          status: Database["public"]["Enums"]["order_status"]
          tax: number
          total_price: number
          total_price_after_discount: number
          total_price_before_discount: number
          updated_at: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          bill_url?: string
          cancel_reason?: string
          country?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_fee: number
          id?: string
          items?: Json[] | null
          payment_method: string
          phone?: string | null
          shipping_address: string
          status?: Database["public"]["Enums"]["order_status"]
          tax: number
          total_price: number
          total_price_after_discount: number
          total_price_before_discount: number
          updated_at?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          bill_url?: string
          cancel_reason?: string
          country?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_fee?: number
          id?: string
          items?: Json[] | null
          payment_method?: string
          phone?: string | null
          shipping_address?: string
          status?: Database["public"]["Enums"]["order_status"]
          tax?: number
          total_price?: number
          total_price_after_discount?: number
          total_price_before_discount?: number
          updated_at?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          discount: number
          discount_type: Database["public"]["Enums"]["discount_type"]
          is_published: boolean
          price_after_discount: number
          price_before_discount: number
          rating: number | null
          rating_count: number
          size: string[] | null
          slug: string
          status: string
          stock: number
          thumbnail: string
          updated_at: string | null
          variations: Json | null
        }
        Insert: {
          created_at?: string
          discount?: number
          discount_type: Database["public"]["Enums"]["discount_type"]
          is_published?: boolean
          price_after_discount: number
          price_before_discount: number
          rating?: number | null
          rating_count?: number
          size?: string[] | null
          slug: string
          status: string
          stock: number
          thumbnail: string
          updated_at?: string | null
          variations?: Json | null
        }
        Update: {
          created_at?: string
          discount?: number
          discount_type?: Database["public"]["Enums"]["discount_type"]
          is_published?: boolean
          price_after_discount?: number
          price_before_discount?: number
          rating?: number | null
          rating_count?: number
          size?: string[] | null
          slug?: string
          status?: string
          stock?: number
          thumbnail?: string
          updated_at?: string | null
          variations?: Json | null
        }
        Relationships: []
      }
      products_categories: {
        Row: {
          category_slug: string
          created_at: string
          product_slug: string
        }
        Insert: {
          category_slug: string
          created_at?: string
          product_slug?: string
        }
        Update: {
          category_slug?: string
          created_at?: string
          product_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_categories_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "products_categories_product_slug_fkey"
            columns: ["product_slug"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["slug"]
          },
        ]
      }
      products_translations: {
        Row: {
          description: string | null
          lang: Database["public"]["Enums"]["languages_enum"]
          product_slug: string
          title: string
        }
        Insert: {
          description?: string | null
          lang: Database["public"]["Enums"]["languages_enum"]
          product_slug: string
          title: string
        }
        Update: {
          description?: string | null
          lang?: Database["public"]["Enums"]["languages_enum"]
          product_slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_translations_product_slug_fkey"
            columns: ["product_slug"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["slug"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          is_published: boolean | null
          product_slug: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          is_published?: boolean | null
          product_slug: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          is_published?: boolean | null
          product_slug?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_slug_fkey"
            columns: ["product_slug"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string | null
          product_slug: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          product_slug: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          product_slug?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      citext:
        | {
            Args: {
              "": boolean
            }
            Returns: string
          }
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: string
          }
      citext_hash: {
        Args: {
          "": string
        }
        Returns: number
      }
      citextin: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      citextout: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      citextrecv: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      citextsend: {
        Args: {
          "": string
        }
        Returns: string
      }
    }
    Enums: {
      discount_type: "percentage" | "amount"
      languages_enum: "fr" | "tr"
      order_status: "Pending" | "Processing" | "Delivered" | "Cancelled"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
