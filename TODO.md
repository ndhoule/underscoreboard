# Victory Validation #
* Players could send a victory socket event
    - Rudimentary solution: Make sure that the code that made the tests pass
      matches the current editor code. Store the code into a variable, run the tests,
      and upon victory signal, ask the editor for its code

# UX #
* Add a preferences cog that pops open a tooltip menu. This menu is where you
  set stuff like user preferences, editor bindings, themes, etc.
    - Default to local storage so that anonymous users' settings will persist
      across refreshes
    - (*SESSIONS*) Allow users to store settings on a per-account level


# Rooms #
* Basic room functionality
* Max clients
    - Two active players per room
    - Infinite number of observers
* Wait for another client to connect before randomizing function
* Named rooms
