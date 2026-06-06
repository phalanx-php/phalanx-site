<?php

declare(strict_types=1);

namespace Phalanx\Site;

use Phalanx\Boot\AppContext;

final class SiteConfig
{
    public function __construct(
        private(set) string $siteUrl,
    ) {}

    public static function fromContext(AppContext $context): self
    {
        return new self(
            siteUrl: $context->string('SITE_URL', 'http://localhost:8091'),
        );
    }
}
