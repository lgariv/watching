import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: "Recommendation ID is required" },
        { status: 400 }
      );
    }
    
    // Fetch the recommendation from Supabase
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching from Supabase:", error);
      return NextResponse.json(
        { error: "Failed to fetch recommendation" },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      );
    }
    
    // Return the recommendation data
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Error retrieving recommendation:", error);
    return NextResponse.json(
      { error: "Failed to retrieve recommendation" },
      { status: 500 }
    );
  }
} 