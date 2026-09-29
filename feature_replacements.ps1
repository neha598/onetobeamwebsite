$content = Get-Content "D:\comfy\Onetobeam_website\Index.html" -Raw

# Bird Eye View (feature 1)
$old1 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-image"" style=""background-image: url('https://www.onetobeam.com/website/images/Iplex features/Bird eye view.png');"">
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">01</div>
                            <h3>Bird Eye View</h3>
                            <p>Experience your property from a bird's eye view before it's even built. Get a comprehensive aerial perspective of the entire development.</p>
                        </div>
                    </div>"

$new1 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-media"">
                            <img class=""feature-image"" src=""https://www.onetobeam.com/website/images/Iplex features/Bird eye view.png"" alt=""Bird Eye View"" loading=""lazy"">
                            <video class=""feature-video"" src=""https://www.onetobeam.com/website/images/Video/Bird eye view.mp4"" autoplay loop muted playsinline preload=""metadata""></video>
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">01</div>
                            <h3>Bird Eye View</h3>
                            <p>Experience your property from a bird's eye view before it's even built. Get a comprehensive aerial perspective of the entire development.</p>
                        </div>
                    </div>"

# Master Layout (feature 2)
$old2 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-image"" style=""background-image: url('https://www.onetobeam.com/website/images/Iplex features/Master layout.png');"">
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">02</div>
                            <h3>Master Layout</h3>
                            <p>Get a complete view of the project, including the overall project area, built-up area, layouts, and key development details. Understand how the entire property is planned and positioned at a glance.</p>
                        </div>
                    </div>"

$new2 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-media"">
                            <img class=""feature-image"" src=""https://www.onetobeam.com/website/images/Iplex features/Master layout.png"" alt=""Master Layout"" loading=""lazy"">
                            <video class=""feature-video"" src=""https://www.onetobeam.com/website/images/Video/Master layout.mp4"" autoplay loop muted playsinline preload=""metadata""></video>
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">02</div>
                            <h3>Master Layout</h3>
                            <p>Get a complete view of the project, including the overall project area, built-up area, layouts, and key development details. Understand how the entire property is planned and positioned at a glance.</p>
                        </div>
                    </div>"

# Maps (feature 3)
$old3 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-image"" style=""background-image: url('https://www.onetobeam.com/website/images/Iplex features/Maps.png');"">
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">03</div>
                            <h3>Maps & Location</h3>
                            <p>See your property's nearby landmarks, connectivity, and surroundings with integrated maps for better location context.</p>
                        </div>
                    </div>"

$new3 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-media"">
                            <img class=""feature-image"" src=""https://www.onetobeam.com/website/images/Iplex features/Maps.png"" alt=""Maps & Location"" loading=""lazy"">
                            <video class=""feature-video"" src=""https://www.onetobeam.com/website/images/Video/Maps.mp4"" autoplay loop muted playsinline preload=""metadata""></video>
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">03</div>
                            <h3>Maps & Location</h3>
                            <p>See your property's nearby landmarks, connectivity, and surroundings with integrated maps for better location context.</p>
                        </div>
                    </div>"

# Amenities (feature 4)
$old4 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-image"" style=""background-image: url('https://www.onetobeam.com/website/images/Iplex features/amenities.png');"">
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">04</div>
                            <h3>Amenities Explorer</h3>
                            <p>Showcase amenities with high-quality images and detailed views -- from pools and gyms to gardens and community spaces.</p>
                        </div>
                    </div>"

$new4 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-media"">
                            <img class=""feature-image"" src=""https://www.onetobeam.com/website/images/Iplex features/amenities.png"" alt=""Amenities Explorer"" loading=""lazy"">
                            <video class=""feature-video"" src=""https://www.onetobeam.com/website/images/Video/amenities.mp4"" autoplay loop muted playsinline preload=""metadata""></video>
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">04</div>
                            <h3>Amenities Explorer</h3>
                            <p>Showcase amenities with high-quality images and detailed views -- from pools and gyms to gardens and community spaces.</p>
                        </div>
                    </div>"

# Simulation (feature 5)
$old5 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-image"" style=""background-image: url('https://www.onetobeam.com/website/images/Iplex features/simulation.png');"">
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">05</div>
                            <h3>Simulations</h3>
                            <p>Day-to-night lighting simulation, route map navigation, shadow studies, and more -- dynamic visualizations at your fingertips.</p>
                        </div>
                    </div>"

$new5 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-media"">
                            <img class=""feature-image"" src=""https://www.onetobeam.com/website/images/Iplex features/simulation.png"" alt=""Simulations"" loading=""lazy"">
                            <video class=""feature-video"" src=""https://www.onetobeam.com/website/images/Video/simulation.mp4"" autoplay loop muted playsinline preload=""metadata""></video>
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">05</div>
                            <h3>Simulations</h3>
                            <p>Day-to-night lighting simulation, route map navigation, shadow studies, and more -- dynamic visualizations at your fingertips.</p>
                        </div>
                    </div>"

# Select with Filters (feature 6)
$old6 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-image"" style=""background-image: url('https://www.onetobeam.com/website/images/Iplex features/filter.png');"">
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">06</div>
                            <h3>Select with Filters</h3>
                            <p>Quickly find available units based on your preferred floor, size, and facing. Explore the right options instantly and make unit selection faster and easier.</p>
                        </div>
                    </div>"

$new6 = @"
                    <div class=""feature-card reveal"">
                        <div class=""feature-media"">
                            <img class=""feature-image"" src=""https://www.onetobeam.com/website/images/Iplex features/filter.png"" alt=""Select with Filters"" loading=""lazy"">
                            <video class=""feature-video"" src=""https://www.onetobeam.com/website/images/Video/filter.mp4"" autoplay loop muted playsinline preload=""metadata""></video>
                        </div>
                        <div class=""feature-content"">
                            <div class=""feature-number"">06</div>
                            <h3>Select with Filters</h3>
                            <p>Quickly find available units based on your preferred floor, size, and facing. Explore the right options instantly and make unit selection faster and easier.</p>
                        </div>
                    </div>"

$content = Get-Content "D:\comfy\Onetobeam_website\Index.html" -Raw
$content = $content.Replace($old1, $new1)
$content = $content.Replace($old2, $new2)
$content = $content.Replace($old3, $new3)
$content = $content.Replace($old4, $new4)
$content = $content.Replace($old5, $new5)
$content = $content.Replace($old6, $new6)
Set-Content "D:\comfy\Onetobeam_website\Index.html" $content
Write-Host "Updated all 6 feature cards with video support"