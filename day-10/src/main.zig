const std = @import("std");

pub fn main() !void {
    //  Get an allocator
    var gp = std.heap.GeneralPurposeAllocator(.{ .safety = true }){};
    defer _ = gp.deinit();
    const allocator = gp.allocator();

    // Get the path
    var path_buffer: [std.fs.MAX_PATH_BYTES]u8 = undefined;
    const path = try std.fs.realpath("./src/input.validate", &path_buffer);

    // Open the file
    const file = try std.fs.openFileAbsolute(path, .{});
    defer file.close();

    // Read the contents
    const buffer_size = 2000;
    const file_buffer = try file.readToEndAlloc(allocator, buffer_size);
    defer allocator.free(file_buffer);

    // Split by "\n" and iterate through the resulting slices of "const []u8"
    var iter = std.mem.split(u8, file_buffer, "\n");

    var count: usize = 0;
    while (iter.next()) |line| : (count += 1) {
        std.log.info("{d:>2}: {s}", .{ count, line });
    }
}

test "simple test" {
    var list = std.ArrayList(i32).init(std.testing.allocator);
    defer list.deinit(); // try commenting this out and see if zig detects the memory leak!
    try list.append(42);
    try std.testing.expectEqual(@as(i32, 42), list.pop());
}
