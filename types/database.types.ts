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
      cfusd_swaps: {
        Row: {
          amount_in: number
          amount_out: number
          id: string
          transaction_id: string | null
        }
        Insert: {
          amount_in: number
          amount_out: number
          id?: string
          transaction_id?: string | null
        }
        Update: {
          amount_in?: number
          amount_out?: number
          id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cfusd_swaps_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "cfusd_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      cfusd_transactions: {
        Row: {
          block_time: number
          date: string
          fee: number
          id: string
          operation: string
          signature: string
          slot: number
        }
        Insert: {
          block_time: number
          date: string
          fee: number
          id?: string
          operation: string
          signature: string
          slot: number
        }
        Update: {
          block_time?: number
          date?: string
          fee?: number
          id?: string
          operation?: string
          signature?: string
          slot?: number
        }
        Relationships: []
      }
      susd_swaps: {
        Row: {
          amount_in: number
          amount_out: number
          id: string
          transaction_id: string | null
        }
        Insert: {
          amount_in: number
          amount_out: number
          id?: string
          transaction_id?: string | null
        }
        Update: {
          amount_in?: number
          amount_out?: number
          id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "susd_swaps_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "susd_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      susd_transactions: {
        Row: {
          block_time: number
          date: string | null
          fee: number
          id: string
          operation: string
          signature: string
          slot: number
        }
        Insert: {
          block_time: number
          date?: string | null
          fee: number
          id?: string
          operation: string
          signature: string
          slot: number
        }
        Update: {
          block_time?: number
          date?: string | null
          fee?: number
          id?: string
          operation?: string
          signature?: string
          slot?: number
        }
        Relationships: []
      }
      swaps: {
        Row: {
          amount_in: number
          amount_out: number
          id: string
          transaction_id: string | null
        }
        Insert: {
          amount_in: number
          amount_out: number
          id?: string
          transaction_id?: string | null
        }
        Update: {
          amount_in?: number
          amount_out?: number
          id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swaps_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          block_time: number
          date: string | null
          fee: number
          id: string
          operation: string
          signature: string
          slot: number
        }
        Insert: {
          block_time: number
          date?: string | null
          fee: number
          id?: string
          operation: string
          signature: string
          slot: number
        }
        Update: {
          block_time?: number
          date?: string | null
          fee?: number
          id?: string
          operation?: string
          signature?: string
          slot?: number
        }
        Relationships: []
      }
      usds_swaps: {
        Row: {
          amount_in: number
          amount_out: number
          id: string
          transaction_id: string | null
        }
        Insert: {
          amount_in: number
          amount_out: number
          id?: string
          transaction_id?: string | null
        }
        Update: {
          amount_in?: number
          amount_out?: number
          id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usds_swaps_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "usds_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      usds_transactions: {
        Row: {
          block_time: number
          date: string
          fee: number
          id: string
          operation: string
          signature: string
          slot: number
        }
        Insert: {
          block_time: number
          date: string
          fee: number
          id?: string
          operation: string
          signature: string
          slot: number
        }
        Update: {
          block_time?: number
          date?: string
          fee?: number
          id?: string
          operation?: string
          signature?: string
          slot?: number
        }
        Relationships: []
      }
      usdy_swaps: {
        Row: {
          amount_in: number
          amount_out: number
          id: string
          transaction_id: string | null
        }
        Insert: {
          amount_in: number
          amount_out: number
          id?: string
          transaction_id?: string | null
        }
        Update: {
          amount_in?: number
          amount_out?: number
          id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usdy_swaps_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "usdy_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      usdy_transactions: {
        Row: {
          block_time: number
          date: string
          fee: number
          id: string
          operation: string
          signature: string
          slot: number
        }
        Insert: {
          block_time: number
          date: string
          fee: number
          id?: string
          operation: string
          signature: string
          slot: number
        }
        Update: {
          block_time?: number
          date?: string
          fee?: number
          id?: string
          operation?: string
          signature?: string
          slot?: number
        }
        Relationships: []
      }
      volumes: {
        Row: {
          calculated_at: string | null
          end_date: string
          id: string
          pool_type: string
          start_date: string
          volume: number
        }
        Insert: {
          calculated_at?: string | null
          end_date: string
          id?: string
          pool_type: string
          start_date: string
          volume: number
        }
        Update: {
          calculated_at?: string | null
          end_date?: string
          id?: string
          pool_type?: string
          start_date?: string
          volume?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
