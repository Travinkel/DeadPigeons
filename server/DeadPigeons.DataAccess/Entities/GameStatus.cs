namespace DeadPigeons.DataAccess.Entities;

public enum GameStatus
{
    Pending,    // Future scheduled game
    Active,     // Current week's game
    Completed,  // Game with winning numbers drawn
    Cancelled
}
